import * as React from 'react';

import { connect } from 'react-redux';
import { NO_DATA_TEXT, NO_SENSORS_EQUIPMENT_TEXT } from 'constants/statuses';
import * as cx from 'classnames';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { carInfoToggleSensorShow } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import { DivNone } from 'global-styled/global-styled';
import { sensorTrackColor } from 'constants/sensors';
import { ColorSensorDiv } from 'components/monitor/info/car-info/car-tab-menu/car-track-information/sensors-track-tab/equipment/styled';

type PropsSensorsEquipmentList = {
  track: any;
  front_cars_sensors_equipment: {
    [key: string]: {
      data: any[];
      show: boolean;
      sensor: {
        type_name: string;
      };
    };
  };
  toggleSensorOnMap: any;
};

const getRightRus = (count) => {
  if (count === 1) {
    return 'датчик';
  }

  if (count > 1 && count < 5) {
    return 'датчика';
  }

  return 'датчиков';
};

const SensorsEquipmentList: React.FC<
  PropsSensorsEquipmentList
> = (props) => {
  const { track } = props;
  const sensors_equipment = Object.entries(props.front_cars_sensors_equipment);

  const disabledByKey = sensors_equipment.reduce(
    (newObj, [key, data]) => ({
      ...newObj,
      [key]: data.data.length === 0 || !data.data.some(([t, value]) => !!value),
    }),
    {},
  );

  const hasSomeData = sensors_equipment.find(([, { show }]) => show);

  return (
    <div className="sensors-list">
      {!track || (Array.isArray(track) && track.length === 0) ? (
        <div>{NO_DATA_TEXT}</div>
      ) : sensors_equipment.length === 0 ? (
        <div>{NO_SENSORS_EQUIPMENT_TEXT}</div>
      ) : (
        <div>
          {sensors_equipment.map(([key, data], index) => {
            const disabled = disabledByKey[key];

            return (
              <div
                className={cx('sensor-option', { disabled })}
                data-key={key}
                key={key}
                onClick={props.toggleSensorOnMap}>
                <input
                  readOnly
                  disabled={disabled}
                  type="checkbox"
                  checked={data.show}
                />
                <span>{` Датчик №${index + 1} - ${
                  data.sensor.type_name
                } `}</span>
                {disabled ? <span> (Нет данных)</span> : <DivNone />}
              </div>
            );
          })}
          {hasSomeData ? (
            <div className="car_info-sensors_legend">
              {[['zero'], ...sensors_equipment].map(([key], index) => (
                <div
                  key={`sensor_option_${key}`}
                  className="sensors_legeng_option">
                  <ColorSensorDiv color={sensorTrackColor[index]} />
                  <div>{`${index} ${getRightRus(index)} в работе`}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="none" />
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  track: state.monitorPage.carInfo.trackCaching.track,
  front_cars_sensors_equipment:
    state.monitorPage.carInfo.trackCaching.front_cars_sensors_equipment,
});
const mergedProps = (stateProps, { dispatch }) => ({
  ...stateProps,
  toggleSensorOnMap: ({
    currentTarget: {
      dataset: { key },
    },
  }) => {
    const {
      front_cars_sensors_equipment: { [key]: sensorData },
    } = stateProps;
    let canChange = false;

    canChange =
      sensorData.data.length > 0 &&
      sensorData.data.some(([t, value]) => !!value);

    if (canChange) {
      dispatch(carInfoToggleSensorShow('equipment', key));
    }
  },
});

export default compose(
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
)(SensorsEquipmentList);
