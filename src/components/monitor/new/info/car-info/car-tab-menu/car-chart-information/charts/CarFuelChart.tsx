import * as React from 'react';
import { connect } from 'react-redux';
import LineChart from 'components/monitor/new/info/car-info/car-tab-menu/car-chart-information/charts/LineChart';
import {
  CAR_INFO_SET_TRACK_CACHING,
} from 'components/monitor/new/info/car-info/redux/modules/car-info';
import { NO_DATA_TEXT, NO_SENSORS_LEVEL_TEXT } from 'constants/statuses';
import EventTable from 'components/monitor/new/info/car-info/car-tab-menu/car-chart-information/charts/event-table/EventTable';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

type PropsCarFuelChart = {
  track: any;
  has_cars_sensors: boolean;
  front_cars_sensors_level: any;
  handleChartClick: any;
  handleEventClick: any;
};

type StateCarFuelChart = {
  sensorRawData: boolean,
  data: any[],
  front_cars_sensors_level: any;
};

const makeData = (front_cars_sensors_level, { sensorRawData = false }) => (
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

class CarFuelChart extends React.Component <PropsCarFuelChart, StateCarFuelChart> {
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
  componentWillReceiveProps(nextProps) {
    const { front_cars_sensors_level } = nextProps;
    if (front_cars_sensors_level !== this.state.front_cars_sensors_level) {
      const data = makeData(front_cars_sensors_level, this.state);

      this.setState({
        front_cars_sensors_level,
        data,
      });
    }
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

const mapStateToProps = state => ({
  has_cars_sensors: state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING) ? -1 : Object.values(state.monitorPage.carInfo.trackCaching.cars_sensors).some(({ type_slug }) => type_slug === 'level'),
  track: state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING) ? -1 : state.monitorPage.carInfo.trackCaching.track,
  front_cars_sensors_level: state.monitorPage.carInfo.trackCaching.front_cars_sensors_level,
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'loader-field',
  }),
  connect(
    mapStateToProps,
  )
)(CarFuelChart);