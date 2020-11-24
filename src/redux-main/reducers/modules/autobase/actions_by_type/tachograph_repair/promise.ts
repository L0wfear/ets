import { TachographRepairService } from 'api/Services';
import { get } from 'lodash';
import { TachographRepairList, TachographRepair } from './@types';
import { tachographRepair } from 'redux-main/reducers/modules/autobase/constants';
import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';

export const createTachographRepair = autobaseCreateByType<TachographRepair>(tachographRepair);
export const updateTachographRepair = autobaseUpdateByType<TachographRepair>(tachographRepair);
export const removeTachographRepair = autobaseRemoveByType(tachographRepair);

export const promiseGetTachographRepairList = async (payload) => {
  let response = null;
  try {
    response = await TachographRepairService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<TachographRepairList> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

export const createSetTachographRepair = (payload) => {
  return createTachographRepair(
    payload,
  );
};

export const updateSetTachographRepair = (payload) => {
  return updateTachographRepair(
    payload,
  );
};

export const autobaseDeleteTachographRepair = (id) => {
  return removeTachographRepair(
    id,
  );
};
