import { TachographService } from 'api/Services';
import { get } from 'lodash';
import { TachographList } from './@types';

export const promiseGetTachographList = async (payload) => {
  let response = null;
  try {
    response = await TachographService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<TachographList> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
