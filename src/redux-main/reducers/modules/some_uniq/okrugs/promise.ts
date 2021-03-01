import { get } from 'lodash';
import { OkrugsService } from 'api/Services';
import { Okrug } from './@types';

export const promiseGetOkrugs = async (payload = {}) => {
  let response = null;
  try {
    response = await OkrugsService.get({ ...payload });
  } catch (error) {
    console.info(error); // eslint-disable-line
  }

  const data: Array<Okrug> = get(response, 'result.rows', []);

  return data;
};
