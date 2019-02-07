import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryBrand } from 'redux-main/reducers/modules/autobase/constants';

export const getBatteryBrand = autobaseLoadByType(batteryBrand);
export const createBatteryBrand = autobaseCreateByType(batteryBrand);
export const updateBatteryBrand = autobaseUpdateByType(batteryBrand);
export const removeBatteryBrand = autobaseRemoveByType(batteryBrand);

export const createSetBatteryBrand = (rawBatteryBrand) => {
  const payload = {
    ...rawBatteryBrand,
  };

  return createBatteryBrand(
    payload,
  );
};
export const updateSetBatteryBrand = (oldBatteryBrand) => {
  const payload = {
    ...oldBatteryBrand,
  };

  return updateBatteryBrand(
    payload,
  );
};
export const autobaseDeleteBatteryBrand = (id) => {
  return removeBatteryBrand(
    id,
  );
};
