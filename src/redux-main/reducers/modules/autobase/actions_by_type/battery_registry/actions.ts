import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetBatteryRegistry,
  createSetBatteryRegistry,
  updateSetBatteryRegistry,
  autobaseDeleteBatteryRegistry,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/promise';

/* ---------- BatteryRegistry ---------- */
export const autobaseSetBatteryRegistry = (batteryRegistryList: BatteryRegistry[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryRegistryList,
    }),
  )
);
export const autobaseResetSetBatteryRegistry = () => (dispatch) => (
  dispatch(
    autobaseSetBatteryRegistry([]),
  )
);
export const autobaseGetSetBatteryRegistry = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetBatteryRegistry(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const batteryRegistryGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetBatteryRegistry(payload, { page, path }),
  );

  dispatch(
    autobaseSetBatteryRegistry(data),
  );

  return {
    batteryRegistryList: data,
  };
};
export const autobaseCreateBatteryRegistry: any = (batteryRegistryOld: BatteryRegistry, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { batteryRegistry } } = await dispatch({
    type: 'none',
    payload: createSetBatteryRegistry(batteryRegistryOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return batteryRegistry;
};
export const autobaseUpdateBatteryRegistry: any = (batteryRegistryOld: BatteryRegistry, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { batteryRegistry } } = await dispatch({
    type: 'none',
    payload: updateSetBatteryRegistry(batteryRegistryOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return batteryRegistry;
};
export const autobaseRemoveBatteryRegistry = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteBatteryRegistry(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
