import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryRegistry } from 'constants/autobase';
import { modufyBatteryData } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/utils';

export const getBatteryRegistry = autobaseLoadByType(batteryRegistry);
export const createBatteryRegistry = autobaseCreateByType(batteryRegistry);
export const updateBatteryRegistry = autobaseUpdateByType(batteryRegistry);
export const removeBatteryRegistry = autobaseRemoveByType(batteryRegistry);

export const getSetBatteryRegistry = async (...payload) => {
  const { data } = await getBatteryRegistry(...payload);

  return {
    data: data.map(modufyBatteryData),
  };
};

export const createSetBatteryRegistry = (rawBatteryRegistry) => {
  const payload = {
    ...rawBatteryRegistry,
  };

  return createBatteryRegistry(
    payload,
  );
};
export const updateSetBatteryRegistry = (oldBatteryRegistry) => {
  const payload = {
    ...oldBatteryRegistry,
  };

  return updateBatteryRegistry(
    payload,
  );
};
export const autobaseDeleteBatteryRegistry = (id) => {
  return removeBatteryRegistry(
    id,
  );
};
