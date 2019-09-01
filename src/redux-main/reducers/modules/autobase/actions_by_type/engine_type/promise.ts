import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { engineType } from 'redux-main/reducers/modules/autobase/constants';
import { EngineType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const createSetEngineType = autobaseCreateByType<EngineType>(engineType);
export const updateSetEngineType = autobaseUpdateByType<EngineType>(engineType);
export const autobaseDeleteEngineType = autobaseRemoveByType(engineType);
