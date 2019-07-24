import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryRegistry } from 'redux-main/reducers/modules/autobase/constants';
import { modufyBatteryData } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/utils';
import { createValidDate } from 'utils/dates';
import { get } from 'lodash';

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
    battery_to_car: get(rawBatteryRegistry, 'battery_to_car', []).map((item) => ({
      ...item,
      car_id: item.car_id,
      installed_at: createValidDate(item.installed_at),
      uninstalled_at: createValidDate(item.uninstalled_at),
    })),
    released_at: createValidDate(rawBatteryRegistry.released_at),
  };

  return createBatteryRegistry(
    payload,
  );
};
export const updateSetBatteryRegistry = (oldBatteryRegistry) => {
  const payload = {
    ...oldBatteryRegistry,
    battery_to_car: get(oldBatteryRegistry, 'battery_to_car', []).map((item) => ({
      ...item,
      car_id: item.car_id,
      installed_at: createValidDate(item.installed_at),
      uninstalled_at: createValidDate(item.uninstalled_at),
    })),
    released_at: createValidDate(oldBatteryRegistry.released_at),
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
