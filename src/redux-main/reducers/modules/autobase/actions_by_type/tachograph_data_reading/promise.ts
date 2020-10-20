import { TachographDataReadingService } from 'api/Services';
import { get } from 'lodash';
import { TachographDataReadingList } from './@types';

export const promiseGetTachographDataReadingList = async (payload: {tachograph_id: number;}) => {
  let response = null;
  try {
    response = await TachographDataReadingService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<TachographDataReadingList> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

export const promiseChangeTachographDataReadingList = async (ownPayload: {tachograph_id: number; data_reading: Array<TachographDataReadingList>;}) => {
  const payload = {
    ...ownPayload,
  };

  const response = await TachographDataReadingService.post(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};
