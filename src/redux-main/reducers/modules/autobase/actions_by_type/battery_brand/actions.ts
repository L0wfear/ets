import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getBatteryBrand,
  createSetBatteryBrand,
  updateSetBatteryBrand,
  autobaseDeleteBatteryBrand,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_brand/promise';

/* ---------- BatteryBrand ---------- */
export const autobaseSetBatteryBrand = (batteryBrandList: BatteryBrand[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryBrandList,
    }),
  )
);
export const autobaseResetSetBatteryBrand = () => (dispatch) => (
  dispatch(
    autobaseSetBatteryBrand([]),
  )
);
export const autobaseGetSetBatteryBrand = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getBatteryBrand(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const batteryBrandGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetBatteryBrand(payload, { page, path }),
  );

  dispatch(
    autobaseSetBatteryBrand(data),
  );

  return {
    batteryBrandList: data,
  };
};
export const autobaseCreateBatteryBrand: any = (batteryBrandOld: BatteryBrand, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { batteryBrand } } = await dispatch({
    type: 'none',
    payload: createSetBatteryBrand(batteryBrandOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return batteryBrand;
};
export const autobaseUpdateBatteryBrand: any = (batteryBrandOld: BatteryBrand, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { batteryBrand } } = await dispatch({
    type: 'none',
    payload: updateSetBatteryBrand(batteryBrandOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return batteryBrand;
};
export const autobaseRemoveBatteryBrand = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteBatteryBrand(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
