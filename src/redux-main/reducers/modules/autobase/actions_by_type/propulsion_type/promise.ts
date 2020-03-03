import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { propulsionType } from 'redux-main/reducers/modules/autobase/constants';
import { PropulsionType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getPropulsionType = autobaseLoadByType<PropulsionType>(propulsionType);
export const createSetPropulsionType = autobaseCreateByType<PropulsionType>(propulsionType);
export const updateSetPropulsionType = autobaseUpdateByType<PropulsionType>(propulsionType);
export const autobaseDeletePropulsionType = autobaseRemoveByType(propulsionType);
