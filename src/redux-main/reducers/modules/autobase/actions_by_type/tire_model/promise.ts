import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireModel } from 'constants/autobase';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getTireModel = autobaseLoadByType(tireModel);
export const createTireModel = autobaseCreateByType(tireModel);
export const updateTireModel = autobaseUpdateByType(tireModel);
export const removeTireModel = autobaseRemoveByType(tireModel);

export const createSetTireModel = (rawTireModel: TireModel) => {
  const payload = {
    ...rawTireModel,
  };

  return createTireModel(
    payload,
  );
};
export const updateSetTireModel = (oldTireModel: TireModel) => {
  const payload = {
    ...oldTireModel,
  };

  return updateTireModel(
    payload,
  );
};
export const autobaseDeleteTireModel = (id) => {
  return removeTireModel(
    id,
  );
};
