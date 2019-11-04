import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getBatteryManufacturer,
  createSetBatteryManufacturer,
  updateSetBatteryManufacturer,
  autobaseDeleteBatteryManufacturer,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- BatteryManufacturer ---------- */
export const autobaseSetBatteryManufacturer = (batteryManufacturerList: Array<BatteryManufacturer>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryManufacturerList,
    }),
  )
);
export const autobaseResetSetBatteryManufacturer = (): EtsAction<EtsActionReturnType<typeof autobaseSetBatteryManufacturer>> => (dispatch) => (
  dispatch(
    autobaseSetBatteryManufacturer([]),
  )
);
export const autobaseGetSetBatteryManufacturer = (payload: Parameters<typeof getBatteryManufacturer>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getBatteryManufacturer>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getBatteryManufacturer(payload),
    meta,
  )
);
export const batteryManufacturerGetAndSetInStore = (...arg: Parameters<typeof autobaseGetSetBatteryManufacturer>): EtsAction<EtsActionReturnType<typeof autobaseGetSetBatteryManufacturer>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetBatteryManufacturer(...arg),
  );

  dispatch(
    autobaseSetBatteryManufacturer(result.data),
  );

  return result;
};
export const autobaseCreateBatteryManufacturer = (batteryManufacturerOld: Parameters<typeof createSetBatteryManufacturer>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetBatteryManufacturer>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetBatteryManufacturer(batteryManufacturerOld),
    meta,
  );
};
export const autobaseUpdateBatteryManufacturer = (batteryManufacturerOld: BatteryManufacturer, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetBatteryManufacturer>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetBatteryManufacturer(batteryManufacturerOld),
    meta,
  );
};
export const autobaseRemoveBatteryManufacturer = (id: BatteryManufacturer['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteBatteryManufacturer>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteBatteryManufacturer(id),
    meta,
  );
};
