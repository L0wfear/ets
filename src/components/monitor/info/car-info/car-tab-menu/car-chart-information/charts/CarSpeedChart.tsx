import * as React from 'react';
import { connect } from 'react-redux';
import LineChart from 'components/monitor/info/car-info/car-tab-menu/car-chart-information/charts/LineChart';
import {
  CAR_INFO_SET_TRACK_CACHING,
} from 'components/monitor/info/car-info/redux-main/modules/car-info';
import { NO_DATA_TEXT } from 'constants/statuses';
import { sensorsMapOptions } from 'constants/sensors';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

type TypeFrontCarsSensorsEquipment = {
  [key: string]: {
    data: any[];
    type_name: string;
    color: string;
    connectNulls: number;
    name: string;
    show: boolean;
  };
};

type PropsCarSpeedChart = {
  track: any;
  lastPoint: any;
  has_cars_sensors: boolean;
  front_cars_sensors_equipment: TypeFrontCarsSensorsEquipment;
  handleChartClick: any;
  handleEventClick: any;
  mkad_speed_lim: number;
  speed_lim: number;
};

type StateCarSpeedChart = {
  lastPoint: any,
  data: any[],
  front_cars_sensors_equipment: TypeFrontCarsSensorsEquipment;
  mkad_speed_lim: number;
  speed_lim: number;
};

const makeData = ({ track, front_cars_sensors_equipment, mkad_speed_lim, speed_lim }) => ([
  {
    name: 'Скорость ТС',
    data: track.map(p => [p.timestamp, parseInt(p.speed_avg, 10)]),
    color: 'rgba(90, 242, 18, 1)',
  },
  {
    name: 'Максимальная скорость',
    data: track.map(({ timestamp, checkCoordsMsk: { onMkad = false } = {} }) => [timestamp, onMkad ? mkad_speed_lim : speed_lim]),
    color: 'rgba(205, 17, 71, 1)',
  },
  ...Object.values(front_cars_sensors_equipment as TypeFrontCarsSensorsEquipment).reduce<any[]>((newArr, sensor) => ([
      ...newArr,
      {
        color: sensor.color,
        connectNulls: sensor.connectNulls,
        enableMouseTracking: false,
        data: sensor.data.map(([timestamp, value, onMkad]) => [
          timestamp,
          value ? sensorsMapOptions(0, onMkad ? mkad_speed_lim : speed_lim).value : null,
        ]) ,
        name: sensor.name,
        values: sensor.data,
      },
    ]), [])
]).filter(({ data }) => (
  data.some(([t, value]) => !!value)
));

const addPointToSeries = (data, { lastPoint: { timestamp, speed_avg, checkCoordsMsk: { onMkad = false } = {} }, mkad_speed_lim, speed_lim }) => {
  return data.map(({ ...seria }, index) => {
    if (index === 0) {
      seria.data.push([ timestamp, speed_avg ]);
    } else if (index === 0) {
      seria.data.push([ timestamp, onMkad ? mkad_speed_lim : speed_lim ]);
    } else {
      seria.data.push([ timestamp, null ]);
    }

    return seria;
  })
}

class CarSpeedChart extends React.Component <PropsCarSpeedChart, StateCarSpeedChart> {
  constructor(props) {
    super(props);

    const { track, front_cars_sensors_equipment, mkad_speed_lim, speed_lim } = props;

    const data = makeData({ track, front_cars_sensors_equipment, mkad_speed_lim, speed_lim });

    this.state = {
      lastPoint: props.lastPoint,
      data,
      front_cars_sensors_equipment,
      mkad_speed_lim,
      speed_lim,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.track !== -1) {
      let changedState: any = {};
      let hasChange = false;

      if (['front_cars_sensors_equipment', 'mkad_speed_lim', 'speed_lim'].some((key) => this.state[key] !== nextProps[key])) {
        hasChange = true;
        changedState = {
          front_cars_sensors_equipment: nextProps.front_cars_sensors_equipment,
          data: makeData(nextProps),
          mkad_speed_lim: nextProps.front_cars_sensors_equipment,
          speed_lim: nextProps.front_cars_sensors_equipment,
        };
      }
      if (this.state.lastPoint !== nextProps.lastPoint) {
        changedState.data = addPointToSeries(changedState.data || this.state.data, nextProps);
        hasChange = true;
        changedState.lastPoint = nextProps.lastPoint;
      }

      if (hasChange) {
        this.setState(changedState);
      }
    }
  }

  handleChartClick = ({ point: { x: timestamp } } ) => {
    const { track } = this.props;

    let selected_point = track[0];

    track.some((track_point, index) => {
      if (Math.abs(timestamp - selected_point.timestamp) >= Math.abs(timestamp - track_point.timestamp)) {
        selected_point = track_point;
        return false;
      }

      return true;
    })

    this.props.handleChartClick(selected_point);
  }

  render() {
    const { track } = this.props;

    return (
      <div>
        {
          track.length === 0 ?
          (
            <div className="center-preloader">
              <div>{NO_DATA_TEXT}</div>
            </div>
          )
          :
          (
            <div className="car_info-line_chart_wrap" >
              <LineChart
                data={this.state.data}
                onClick={this.handleChartClick}
                name="test"
                showX
              />
            </div>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  has_cars_sensors: Object.values(state.monitorPage.carInfo.trackCaching.cars_sensors).some(({ type_slug }) => type_slug === 'level'),
  track: state.monitorPage.carInfo.trackCaching.track,
  front_cars_sensors_equipment: state.monitorPage.carInfo.trackCaching.front_cars_sensors_equipment,
  mkad_speed_lim: state.monitorPage.carInfo.missionsData.mkad_speed_lim,
  speed_lim: state.monitorPage.carInfo.missionsData.speed_lim,
  lastPoint: state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING) || state.monitorPage.carInfo.trackCaching.track === -1 ? false : (state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null),
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'loader-field',
  }),
  connect(
    mapStateToProps,
  )
)(CarSpeedChart);
