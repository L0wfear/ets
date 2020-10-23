import { RefillService } from 'api/Services';
import { get } from 'lodash';
import { Refill } from './@types';

export const promiseGetRefillList = async (payload) => {
  let response = null;
  try {
    response = await RefillService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<Refill> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
