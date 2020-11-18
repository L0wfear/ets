import * as React from 'react';
import { connect } from 'react-redux';
import LineChart from 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/charts/LineChart';
import { CAR_INFO_SET_TRACK_CACHING } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import { NO_DATA_TEXT } from 'constants/statuses';
import { sensorsMapOptions } from 'constants/sensors';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';

import {
  PropsCarSpeedChart,
  OwnPropsCarSpeedChart,
  StatePropsCarSpeedChart,
  DispatchPropsCarSpeedChart,
  StateCarSpeedChart,
} from 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/charts/types.d';
import { ReduxState } from 'redux-main/@types/state';

const makeData = ({
  track,
  front_cars_sensors_equipment,
  mkad_speed_lim,
  speed_lim,
}: PropsCarSpeedChart) =>
  [
    {
      name: 'Скорость ТС',
      data: track.map((p) => [p.timestamp, parseInt(p.speed_avg, 10)]),
      color: 'rgba(90, 242, 18, 1)',
    },
    {
      name: 'Максимальная скорость',
      data: track.map(
        ({ timestamp, checkCoordsMsk: { onMkad = false } = {} }) => [
          timestamp,
          onMkad ? mkad_speed_lim : speed_lim,
        ],
      ),
      color: 'rgba(205, 17, 71, 1)',
    },
    ...Object.values(
      front_cars_sensors_equipment,
    ).reduce<Array<any>>(
      (newArr, sensor, index) => [
        ...newArr,
        {
          color: sensor.color,
          connectNulls: sensor.connectNulls,
          enableMouseTracking: false,
          data: sensor.data.map(([timestamp, value, onMkad]) => [
            timestamp,
            value
              ? sensorsMapOptions(index, onMkad ? mkad_speed_lim : speed_lim)
                .value
              : null,
          ]),
          name: sensor.name,
          values: sensor.data,
        },
      ],
      [],
    ),
  ].filter(({ data }) => data.some(([t, value]) => !!value));

const addPointToSeries = (
  data,
  {
    lastPoint,
    mkad_speed_lim,
    speed_lim,
  },
) => {
  const timestamp = lastPoint?.timestamp;
  const speed_avg = lastPoint?.speed_avg;
  const onMkad = lastPoint?.checkCoordsMsk?.onMkad || false;

  return data.map(({ ...seria }, index) => {
    if (index === 0) {
      seria.data.push([timestamp, speed_avg]);
    } else if (index === 0) {
      seria.data.push([timestamp, onMkad ? mkad_speed_lim : speed_lim]);
    } else {
      seria.data.push([timestamp, null]);
    }

    return seria;
  });
};

class CarSpeedChart extends React.Component<
  PropsCarSpeedChart,
  StateCarSpeedChart
> {
  constructor(props) {
    super(props);

    const {
      front_cars_sensors_equipment,
      mkad_speed_lim,
      speed_lim,
    } = props;

    const data = makeData(props);

    this.state = {
      lastPoint: props.lastPoint,
      data,
      front_cars_sensors_equipment,
      mkad_speed_lim,
      speed_lim,
    };
  }
  static getDerivedStateFromProps(
    nextProps: PropsCarSpeedChart,
    prevState: StateCarSpeedChart,
  ) {
    if (nextProps.track !== -1) {
      let changedState: any = {};
      let hasChange = false;

      if (
        ['front_cars_sensors_equipment', 'mkad_speed_lim', 'speed_lim'].some(
          (key) => prevState[key] !== nextProps[key],
        )
      ) {
        hasChange = true;
        changedState = {
          front_cars_sensors_equipment: nextProps.front_cars_sensors_equipment,
          data: makeData(nextProps),
          mkad_speed_lim: nextProps.front_cars_sensors_equipment,
          speed_lim: nextProps.front_cars_sensors_equipment,
        };
      }
      if (prevState.lastPoint !== nextProps.lastPoint) {
        changedState.data = addPointToSeries(
          changedState.data || prevState.data,
          nextProps,
        );
        hasChange = true;
        changedState.lastPoint = nextProps.lastPoint;
      }

      if (hasChange) {
        return changedState;
      }
    }

    return null;
  }

  handleChartClick = ({ point: { x: timestamp } }) => {
    const { track } = this.props;

    let selected_point = track[0];

    track.some((track_point, index) => {
      if (
        Math.abs(timestamp - selected_point.timestamp)
        >= Math.abs(timestamp - track_point.timestamp)
      ) {
        selected_point = track_point;
        return false;
      }

      return true;
    });

    this.props.handleChartClick(selected_point);
  };

  render() {
    const { track } = this.props;

    return (
      <div>
        {track.length === 0 ? (
          <div className="center-preloader">
            <div>{NO_DATA_TEXT}</div>
          </div>
        ) : (
          <div className="car_info-line_chart_wrap">
            <LineChart
              data={this.state.data}
              onClick={this.handleChartClick}
              name="speed-chart"
              showX
            />
          </div>
        )}
      </div>
    );
  }
}

export default compose<PropsCarSpeedChart, OwnPropsCarSpeedChart>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
  }),
  connect<
    StatePropsCarSpeedChart,
    DispatchPropsCarSpeedChart,
    OwnPropsCarSpeedChart,
    ReduxState
  >((state) => ({
    has_cars_sensors: Object.values(
      state.monitorPage.carInfo.trackCaching.cars_sensors,
    ).some(({ type_slug }) => type_slug === 'level'),
    track: state.monitorPage.carInfo.trackCaching.track,
    front_cars_sensors_equipment:
      state.monitorPage.carInfo.trackCaching.front_cars_sensors_equipment,
    mkad_speed_lim: state.monitorPage.carInfo.missionsAndWaybillsData.mkad_speed_lim,
    speed_lim: state.monitorPage.carInfo.missionsAndWaybillsData.speed_lim,
    lastPoint:
      state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING)
      || state.monitorPage.carInfo.trackCaching.track === -1
        ? false
        : state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null,
  })),
)(CarSpeedChart);
