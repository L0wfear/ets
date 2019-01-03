import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryManufacturer } from 'redux-main/reducers/modules/autobase/constants';

export const getBatteryManufacturer = autobaseLoadByType(batteryManufacturer);
export const createBatteryManufacturer = autobaseCreateByType(batteryManufacturer);
export const updateBatteryManufacturer = autobaseUpdateByType(batteryManufacturer);
export const removeBatteryManufacturer = autobaseRemoveByType(batteryManufacturer);

export const createSetBatteryManufacturer = (rawBatteryManufacturer) => {
  const payload = {
    ...rawBatteryManufacturer,
  };

  return createBatteryManufacturer(
    payload,
  );
};
export const updateSetBatteryManufacturer = (oldBatteryManufacturer) => {
  const payload = {
    ...oldBatteryManufacturer,
  };

  return updateBatteryManufacturer(
    payload,
  );
};
export const autobaseDeleteBatteryManufacturer = (id) => {
  return removeBatteryManufacturer(
    id,
  );
};
