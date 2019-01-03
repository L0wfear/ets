import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { propulsionType } from 'constants/autobase';

export const getPropulsionType = autobaseLoadByType(propulsionType);
export const createPropulsionType = autobaseCreateByType(propulsionType);
export const updatePropulsionType = autobaseUpdateByType(propulsionType);
export const removePropulsionType = autobaseRemoveByType(propulsionType);

export const createSetPropulsionType = (rawPropulsionType) => {
  const payload = {
    ...rawPropulsionType,
  };

  return createPropulsionType(
    payload,
  );
};
export const updateSetPropulsionType = (oldPropulsionType) => {
  const payload = {
    ...oldPropulsionType,
  };

  return updatePropulsionType(
    payload,
  );
};
export const autobaseDeletePropulsionType = (id) => {
  return removePropulsionType(
    id,
  );
};
