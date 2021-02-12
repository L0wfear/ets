import { TrackSensor } from 'api/Services';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { SensorDut } from 'redux-main/reducers/modules/some_uniq/sensor_dut/@types';
import { createValidDate, makeUnixTimeMskTimezone } from 'components/@next/@utils/dates/dates';

export const promiseGetTrackSensor = async (payloadOwn: { car_id: Car['asuods_id']; ts?: Parameters<typeof makeUnixTimeMskTimezone>[0]; }) => {
  let response = null;
  const payload = {
    ts: payloadOwn.ts
  };

  try {
    response = await TrackSensor.path(`${payloadOwn.car_id}/dut`).get(payloadOwn.ts ? payload : {});
  } catch {
    //
  }

  const data: Array<SensorDut> = response.map((sensor) => {
    return ({
      ...sensor,
      tar_start_date: createValidDate(sensor.tar_start_date),
      tar_end_date: createValidDate(sensor.tar_end_date),
    });
  });

  return data;
};
