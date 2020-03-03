import { RefillTypeService } from 'api/Services';
import { RefillType } from './@types/refillType';
import { get } from 'lodash';

export const promiseLoadRefillType = async (payload: any) => {
  let response = null;

  try {
    response = await RefillTypeService.get({
      ...payload,
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: Array<RefillType> = get(response, 'result.rows', []);

  return result;
};
