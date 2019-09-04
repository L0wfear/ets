import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryRegistry } from 'redux-main/reducers/modules/autobase/constants';
import { modifyBatteryData } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/utils';
import { createValidDate } from 'components/@next/@utils/dates/dates';
import { get } from 'lodash';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getBatteryRegistry = autobaseLoadByType<BatteryRegistry>(batteryRegistry);
export const createBatteryRegistry = autobaseCreateByType<BatteryRegistry>(batteryRegistry);
export const updateBatteryRegistry = autobaseUpdateByType<BatteryRegistry>(batteryRegistry);
export const autobaseDeleteBatteryRegistry = autobaseRemoveByType(batteryRegistry);

export const getSetBatteryRegistry = async (...payload: [any]) => {
  const { data } = await getBatteryRegistry(...payload);

  return {
    data: data.map(modifyBatteryData),
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
