import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { engineType } from 'redux-main/reducers/modules/autobase/constants';

export const createEngineType = autobaseCreateByType(engineType);
export const updateEngineType = autobaseUpdateByType(engineType);
export const removeEngineType = autobaseRemoveByType(engineType);

export const createSetEngineType = (rawEngineType) => {
  const payload = {
    ...rawEngineType,
  };

  return createEngineType(
    payload,
  );
};
export const updateSetEngineType = (oldEngineType) => {
  const payload = {
    ...oldEngineType,
  };

  return updateEngineType(
    payload,
  );
};
export const autobaseDeleteEngineType = (id) => {
  return removeEngineType(
    id,
  );
};
