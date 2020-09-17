import { PenaltiesService } from 'api/Services';
import { get } from 'lodash';
import { Penalty } from './@types';

export const promiseGetPenaltyList = async (payload) => {
  let response = null;
  try {
    response = await PenaltiesService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<Penalty> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
