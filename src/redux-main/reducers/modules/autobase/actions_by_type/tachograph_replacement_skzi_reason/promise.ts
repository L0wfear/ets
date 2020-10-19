import { TachographReplacementSkziReasonService } from 'api/Services';
import { get } from 'lodash';
import { TachographReplacementSkziReason } from './@types';

export const promiseGetTachographReplacementSkziReasonList = async () => {
  let response = null;
  try {
    response = await TachographReplacementSkziReasonService.get();
  } catch (error) {
    //
  }

  const data: Array<TachographReplacementSkziReason> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};