import { CarMileageOptionsService } from 'api/Services';
import { get } from 'lodash';
import { MileageType } from './@types';

export const promiseGetMileageOptions = async (payload): Promise<{data: Array<MileageType>;}> => {
  let response = null;
  try {
    response = await CarMileageOptionsService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
