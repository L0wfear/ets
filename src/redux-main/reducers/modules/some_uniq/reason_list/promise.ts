import { ReasonListService } from 'api/Services';
import { get } from 'lodash';
import { ReasonList } from './@types';

export const promiseGetReasonList = async (payload) => {
  let response = null;
  try {
    response = await ReasonListService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<ReasonList> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
