import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireModel } from 'redux-main/reducers/modules/autobase/constants';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getTireModel = autobaseLoadByType<TireModel>(tireModel);
export const createSetTireModel = autobaseCreateByType<TireModel>(tireModel);
export const updateSetTireModel = autobaseUpdateByType<TireModel>(tireModel);
export const autobaseDeleteTireModel = autobaseRemoveByType(tireModel);
