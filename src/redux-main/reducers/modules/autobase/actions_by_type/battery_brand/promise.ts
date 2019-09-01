import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryBrand } from 'redux-main/reducers/modules/autobase/constants';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getBatteryBrand = autobaseLoadByType<BatteryBrand>(batteryBrand);
export const createSetBatteryBrand = autobaseCreateByType<BatteryBrand>(batteryBrand);
export const updateSetBatteryBrand = autobaseUpdateByType<BatteryBrand>(batteryBrand);
export const autobaseDeleteBatteryBrand = autobaseRemoveByType(batteryBrand);
