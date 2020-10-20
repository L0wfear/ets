import { TachographReplacementSkziService } from 'api/Services';
import { get } from 'lodash';
import { TachographReplacementSkziList, TachographReplacementSkziPayload } from './@types';

export const promiseGetTachographReplacementSkziList = async (payload: {tachograph_id: number;}) => {
  let response = null;
  try {
    response = await TachographReplacementSkziService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<TachographReplacementSkziList> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

export const promiseChangeTachographReplacementSkziList = async (ownPayload: TachographReplacementSkziPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await TachographReplacementSkziService.post(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};
