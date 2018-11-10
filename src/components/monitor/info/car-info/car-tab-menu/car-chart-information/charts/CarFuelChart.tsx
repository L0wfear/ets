import * as React from 'react';
import { connect } from 'react-redux';
import LineChart from 'components/monitor/info/car-info/car-tab-menu/car-chart-information/charts/LineChart';
import { NO_DATA_TEXT, NO_SENSORS_LEVEL_TEXT } from 'constants/statuses';
import EventTable from 'components/monitor/info/car-info/car-tab-menu/car-chart-information/charts/event-table/EventTable';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';

import {
  TypeFrontCarsSensorsLevel,
  PropsCarFuelChart,
  StateCarFuelChart,
  StatePropsCarFuelChart,
  OwnPropsCarFuelChart,
  DispatchPropsCarFuelChart,
} from 'components/monitor/info/car-info/car-tab-menu/car-chart-information/charts/types.d';

const makeData = (front_cars_sensors_level: TypeFrontCarsSensorsLevel, { sensorRawData = false }) => (
  Object.values(front_cars_sensors_level).reduce((newArr, sensor) => {
    const data = sensor[sensorRawData ? 'raw_data' : 'data'];

    if (sensor.data.length) {
      newArr = [
        ...newArr,
        {
          color: sensor.color,
          connectNulls: sensor.connectNulls,
          data,
          name: sensor.name,
          values: sensor.data,
        },
      ];
    }

    return newArr;
  }, [])
)

class CarFuelChart extends React.Component<PropsCarFuelChart, StateCarFuelChart> {
  constructor(props) {
    super(props);

    const sensorRawData = false;
    const { front_cars_sensors_level } = props;

    const data = makeData(front_cars_sensors_level, { sensorRawData });

    this.state = {
      sensorRawData,
      data,
      front_cars_sensors_level,
    }
  }
  static getDerivedStateFromProps(nextProps: PropsCarFuelChart, prevState: StateCarFuelChart) {
    const { front_cars_sensors_level } = nextProps;
    if (front_cars_sensors_level !== prevState.front_cars_sensors_level) {
      const data = makeData(front_cars_sensors_level, prevState);

      return {
        front_cars_sensors_level,
        data,
      };
    }

    return null;
  }
  handleClick = () => {
    const sensorRawData = !this.state.sensorRawData;

    this.setState({
      sensorRawData,
      data: makeData(this.state.front_cars_sensors_level, { sensorRawData }),
    });
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
    const { data } = this.state;
    
    return (
      <div>
        {
          this.props.track.length === 0 ?
          (
            <div className="center-preloader">
              <div>{NO_DATA_TEXT}</div>
            </div>
          )
          :
          (
            <div className="car_info-line_chart_wrap" >
              {
                !this.props.has_cars_sensors ?
                (
                  <div className="center-preloader">
                    {NO_SENSORS_LEVEL_TEXT}
                  </div>
                )
                :
                (
                  data.length === 0 ?
                  (
                    <div className="center-preloader">
                      <div>{NO_DATA_TEXT}</div>
                    </div>
                  )

                  :
                  [
                    <LineChart
                      key="fuel-chart"
                      data={data}
                      onClick={this.handleChartClick}
                      name="test"
                      showX
                    />,
                    <div key="checkbox-fuel" className="chart-select_raw" onClick={this.handleClick}>
                      <input readOnly type="checkbox" checked={this.state.sensorRawData} />
                      <span>Исходные данные датчиков</span>
                    </div>
                  ]
                )
              }
              <EventTable handleEventClick={this.props.handleEventClick} />
            </div>
          )
        }
      </div>
    )
  }
}

export default compose<PropsCarFuelChart, OwnPropsCarFuelChart>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
  }),
  connect<StatePropsCarFuelChart, DispatchPropsCarFuelChart, OwnPropsCarFuelChart, ReduxState>(
    (state) => ({
      has_cars_sensors: Object.values(state.monitorPage.carInfo.trackCaching.cars_sensors).some(({ type_slug }) => type_slug === 'level'),
      track: state.monitorPage.carInfo.trackCaching.track,
      front_cars_sensors_level: state.monitorPage.carInfo.trackCaching.front_cars_sensors_level,
    }),
  ),
)(CarFuelChart);