import { TachographMetrologicalVerificationService } from 'api/Services';
import { get } from 'lodash';
import { TachographMetrologicalVerification, TachographMetrologicalVerificationList } from './@types';
import { tachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/constants';
import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';

export const createTachographMetrologicalVerification = autobaseCreateByType<TachographMetrologicalVerification>(tachographMetrologicalVerification);
export const updateTachographMetrologicalVerification = autobaseUpdateByType<TachographMetrologicalVerification>(tachographMetrologicalVerification);
export const removeTachographMetrologicalVerification = autobaseRemoveByType(tachographMetrologicalVerification);

export const promiseGetTachographMetrologicalVerificationList = async (payload) => {
  let response = null;
  try {
    response = await TachographMetrologicalVerificationService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<TachographMetrologicalVerificationList> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

export const createSetTachographMetrologicalVerification = (payload) => {
  return createTachographMetrologicalVerification(
    payload,
  );
};

export const updateSetTachographMetrologicalVerification = (payload) => {
  return updateTachographMetrologicalVerification(
    payload,
  );
};

export const autobaseDeleteTachographMetrologicalVerification = (id) => {
  return removeTachographMetrologicalVerification(
    id,
  );
};
