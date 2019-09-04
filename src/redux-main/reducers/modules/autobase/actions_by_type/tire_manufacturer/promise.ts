import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireManufacturer } from 'redux-main/reducers/modules/autobase/constants';
import { TireManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getTireManufacturer = autobaseLoadByType<TireManufacturer>(tireManufacturer);
