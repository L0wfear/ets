import { get } from 'lodash';
import { MeasureUnitService } from 'api/Services';
import { MeasureUnit } from './@types';

export const promiseLoadMeasureUnit = async (payload: any) => {
  let response = null;

  try {
    response = await MeasureUnitService.get(payload);
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: MeasureUnit[] = get(response, 'result.rows', []);

  return {
    data: result,
  };
};
