import * as React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import LineChart from 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/charts/LineChart';
import { NO_DATA_TEXT, NO_SENSORS_LEVEL_TEXT } from 'constants/statuses';
import EventTable from 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/charts/event-table/EventTable';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';

import {
  PropsCarFuelChart,
  StateCarFuelChart,
  StatePropsCarFuelChart,
  OwnPropsCarFuelChart,
  DispatchPropsCarFuelChart,
} from 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/charts/types.d';
import { isObject, isArray } from 'util';
import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';

const makeData = (front_cars_sensors_level: IStateMonitorPage['carInfo']['trackCaching']['front_cars_sensors_level'], sensorRawData = false) => (
  Object.values(front_cars_sensors_level).reduce((newArr, sensor) => {
    const data = sensor[sensorRawData ? 'raw_data' : 'data'];

    if (sensor.data.length) {
      return [
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
);

class CarFuelChart extends React.Component<PropsCarFuelChart, StateCarFuelChart> {
  state = {
    sensorRawData: false,
  };

  handleClick = () => {
    const sensorRawData = !this.state.sensorRawData;

    this.setState({
      sensorRawData,
    });
  };

  handleChartClick = ({ point: { x: timestamp } } ) => {
    const { track } = this.props;

    let selected_point = track[0];

    (track as []).some((track_point: any, index) => {
      if (Math.abs(timestamp - selected_point.timestamp) >= Math.abs(timestamp - track_point.timestamp)) {
        selected_point = track_point;
        return false;
      }

      return true;
    });

    this.props.handleChartClick(selected_point);
  };

  makeData = memoize(
    (front_cars_sensors_level, sensorRawData) => (
      makeData(
        front_cars_sensors_level,
        sensorRawData,
      )
    ),
  );

  render() {
    const {
      sensorRawData,
    } = this.state;
    const {
      front_cars_sensors_level,
    } = this.props;

    const data = this.makeData(
      front_cars_sensors_level,
      sensorRawData,
    );

    return (
      <div>
        {
          Boolean(isArray(this.props.track) ? this.props.track.length === 0 : true)
            ? (
              <div className="center-preloader">
                <div>{NO_DATA_TEXT}</div>
              </div>
            )
            : (
              <div className="car_info-line_chart_wrap" >
                {
                  !this.props.has_cars_sensors
                    ? (
                      <div className="center-preloader">
                        {NO_SENSORS_LEVEL_TEXT}
                      </div>
                    )
                    :                (
                      data.length === 0
                        ? (
                          <div className="center-preloader">
                            <div>{NO_DATA_TEXT}</div>
                          </div>
                        )

                        :                  <React.Fragment>
                          <LineChart
                            data={data}
                            onClick={this.handleChartClick}
                            name="fuel-chart"
                            showX
                          />
                          <div className="chart-select_raw" onClick={this.handleClick}>
                            <input readOnly type="checkbox" checked={this.state.sensorRawData} />
                            <span>Исходные данные датчиков</span>
                          </div>
                        </React.Fragment>
                    )
                }
                <EventTable handleEventClick={this.props.handleEventClick} />
              </div>
            )
        }
      </div>
    );
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
      has_cars_sensors: isObject(state.monitorPage.carInfo.trackCaching.cars_sensors) ? Object.values(state.monitorPage.carInfo.trackCaching.cars_sensors).some(({ type_slug }) => type_slug === 'level') : false,
      front_cars_sensors_level: state.monitorPage.carInfo.trackCaching.front_cars_sensors_level,
      track: isArray(state.monitorPage.carInfo.trackCaching.track) ? state.monitorPage.carInfo.trackCaching.track : [],
    }),
  ),
)(CarFuelChart);
