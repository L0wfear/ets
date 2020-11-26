import { AutoBase } from 'api/Services';
import { get } from 'lodash';
import { TachographRepairReasonList } from './@types';
import { tachographRepairReason } from 'redux-main/reducers/modules/autobase/constants';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';

export const promiseGetTachographRepairReasonList = async (payload) => {
  let response = null;
  try {
    response = await AutoBase.path(AUTOBASE[tachographRepairReason]).get(payload);
  } catch (error) {
    //
  }

  const data: Array<TachographRepairReasonList> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
