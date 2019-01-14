import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getBatteryManufacturer,
  createSetBatteryManufacturer,
  updateSetBatteryManufacturer,
  autobaseDeleteBatteryManufacturer,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/promise';

/* ---------- BatteryManufacturer ---------- */
export const autobaseSetBatteryManufacturer = (batteryManufacturerList: BatteryManufacturer[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryManufacturerList,
    }),
  )
);
export const autobaseResetSetBatteryManufacturer = () => (dispatch) => (
  dispatch(
    autobaseSetBatteryManufacturer([]),
  )
);
export const autobaseGetSetBatteryManufacturer: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getBatteryManufacturer(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const batteryManufacturerGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetBatteryManufacturer(payload, { page, path }),
  );

  dispatch(
    autobaseSetBatteryManufacturer(data),
  );

  return {
    batteryManufacturerList: data,
  };
};
export const autobaseCreateBatteryManufacturer: any = (batteryManufacturerOld: BatteryManufacturer, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { batteryManufacturer } } = await dispatch({
    type: 'none',
    payload: createSetBatteryManufacturer(batteryManufacturerOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return batteryManufacturer;
};
export const autobaseUpdateBatteryManufacturer: any = (batteryManufacturerOld: BatteryManufacturer, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { batteryManufacturer } } = await dispatch({
    type: 'none',
    payload: updateSetBatteryManufacturer(batteryManufacturerOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return batteryManufacturer;
};
export const autobaseRemoveBatteryManufacturer = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteBatteryManufacturer(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
