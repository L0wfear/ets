import { SensorTypeService } from 'api/Services';
import { get } from 'lodash';
import { SensorType } from './@types/sensor_type';

export const promiseGetSensorType = async (payload: any) => {
  let response = null;
  try {
    response = await SensorTypeService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: SensorType[] = get(response, 'result.rows', []);

  return data;
};
