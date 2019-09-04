import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getBatteryBrand,
  createSetBatteryBrand,
  updateSetBatteryBrand,
  autobaseDeleteBatteryBrand,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_brand/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- BatteryBrand ---------- */
export const autobaseSetBatteryBrand = (batteryBrandList: BatteryBrand[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryBrandList,
    }),
  )
);
export const autobaseResetSetBatteryBrand = (): EtsAction<EtsActionReturnType<typeof autobaseSetBatteryBrand>> => (dispatch) => (
  dispatch(
    autobaseSetBatteryBrand([]),
  )
);
export const autobaseGetSetBatteryBrand = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getBatteryBrand>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getBatteryBrand(payload),
    meta,
  )
);
export const batteryBrandGetAndSetInStore = (...arg: Parameters<typeof autobaseGetSetBatteryBrand>): EtsAction<EtsActionReturnType<typeof getBatteryBrand>>  => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetBatteryBrand(...arg),
  );

  dispatch(
    autobaseSetBatteryBrand(result.data),
  );

  return result;
};
export const autobaseCreateBatteryBrand = (batteryBrandOld: BatteryBrand, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetBatteryBrand>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetBatteryBrand(batteryBrandOld),
    meta,
  );
};
export const autobaseUpdateBatteryBrand = (batteryBrandOld: BatteryBrand, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetBatteryBrand>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetBatteryBrand(batteryBrandOld),
    meta,
  );
};
export const autobaseRemoveBatteryBrand = (id: BatteryBrand['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteBatteryBrand>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteBatteryBrand(id),
    meta,
  );
};
