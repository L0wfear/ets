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

export const promiseCreateTachograph = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await TachographService.post(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};

export const promiseUpdateTachograph = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await TachographService.put(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};

export const promiseDeleteTachograph = async (id: number) => {
  const payload = {
    id,
  };

  const response = await TachographService.delete(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};