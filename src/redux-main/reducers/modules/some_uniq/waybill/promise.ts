import { ReasonOptionService } from 'api/Services';
import { get } from 'lodash';
import { ReasonOptions } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export const promiseGetReasonOption = async (payload) => {
  let response = null;
  try {
    response = await ReasonOptionService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<ReasonOptions> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
