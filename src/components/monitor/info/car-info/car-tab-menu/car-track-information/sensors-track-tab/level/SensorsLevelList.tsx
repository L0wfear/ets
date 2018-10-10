import * as React from 'react';

import { connect } from 'react-redux';
import { NO_DATA_TEXT, NO_SENSORS_LEVEL_TEXT } from 'constants/statuses';
import * as cx from 'classnames';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { carInfoToggleSensorShow } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import {
  DivNone,
} from 'global-styled/global-styled';

type PropsSensorsTrackTab = {
  track: any;
  front_cars_sensors_level: {
    [key: string]: {
      data: any[];
      show: boolean;
    };
  };
  toggleSensorOnMap: any;
};

const SensorsLevelList: React.SFC<PropsSensorsTrackTab> = props => {
  const { track } = props;
  const sensors_level = Object.entries(props.front_cars_sensors_level);

  return (
    <div className="sensors-list">
      {
        !track || Array.isArray(track) && track.length === 0 ?
        (
          <div>{NO_DATA_TEXT}</div>
        )
        :
        (
          sensors_level.length === 0 ?
          (
            <div>{NO_SENSORS_LEVEL_TEXT}</div>
          )
          :
          (
            sensors_level.map(([key, data]) => (
              <div className={cx('sensor-option', { disabled: data.data.length === 0 })} data-key={key} key={key} onClick={props.toggleSensorOnMap}>
                <input readOnly disabled={data.data.length === 0} type="checkbox" checked={data.show} />
                <span>{` ДУТ №${key}` }</span>
                {
                  data.data.length === 0 ?
                    <span> (Нет данных)</span>
                  :
                    ( <DivNone /> )
                }
              </div>
            ))
          )
        )
      }
    </div>
  )
};

const mapStateToProps = state => ({
  track: state.monitorPage.carInfo.trackCaching.track,
  front_cars_sensors_level: state.monitorPage.carInfo.trackCaching.front_cars_sensors_level,
});
const mergedProps = (stateProps, { dispatch }) => ({
  ...stateProps,
  toggleSensorOnMap: ({ currentTarget: { dataset: { key } } }) => {
    const { front_cars_sensors_level: { [key]: sensorData } } = stateProps;
    let canChange = false;

    canChange = sensorData.data.length > 0;

    if (canChange) {
      dispatch(
        carInfoToggleSensorShow(
          'level',
          key,
        )
      );
    }
  }
})

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
  }),
  connect(
    mapStateToProps,
    null,
    mergedProps,
  ),
)(SensorsLevelList);
