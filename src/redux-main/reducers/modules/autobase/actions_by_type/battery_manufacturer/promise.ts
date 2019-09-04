import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryManufacturer } from 'redux-main/reducers/modules/autobase/constants';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getBatteryManufacturer = autobaseLoadByType<BatteryManufacturer>(batteryManufacturer);
export const createSetBatteryManufacturer = autobaseCreateByType<BatteryManufacturer>(batteryManufacturer);
export const updateSetBatteryManufacturer = autobaseUpdateByType<BatteryManufacturer>(batteryManufacturer);
export const autobaseDeleteBatteryManufacturer = autobaseRemoveByType(batteryManufacturer);
