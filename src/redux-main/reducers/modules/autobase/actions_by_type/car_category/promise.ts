import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { carCategory } from 'redux-main/reducers/modules/autobase/constants';
import { CarCategory } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const createSetCarCategory = autobaseCreateByType<CarCategory>(carCategory);
export const updateSetCarCategory = autobaseUpdateByType<CarCategory>(carCategory);
export const autobaseDeleteCarCategory = autobaseRemoveByType(carCategory);
