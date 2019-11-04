import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetBatteryRegistry,
  createSetBatteryRegistry,
  updateSetBatteryRegistry,
  autobaseDeleteBatteryRegistry,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- BatteryRegistry ---------- */
export const autobaseSetBatteryRegistry = (batteryRegistryList: BatteryRegistry[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryRegistryList,
    }),
  )
);
export const autobaseResetSetBatteryRegistry = (): EtsAction<EtsActionReturnType<typeof autobaseSetBatteryRegistry>> => (dispatch) => (
  dispatch(
    autobaseSetBatteryRegistry([]),
  )
);
export const autobaseGetSetBatteryRegistry = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetBatteryRegistry>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSetBatteryRegistry(payload),
    meta,
  )
);
export const batteryRegistryGetAndSetInStore = (...arg: Parameters<typeof autobaseGetSetBatteryRegistry>): EtsAction<EtsActionReturnType<typeof autobaseGetSetBatteryRegistry>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetBatteryRegistry(...arg),
  );

  dispatch(
    autobaseSetBatteryRegistry(result.data),
  );

  return result;
};
export const autobaseCreateBatteryRegistry = (batteryRegistryOld: BatteryRegistry, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetBatteryRegistry>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetBatteryRegistry(batteryRegistryOld),
    meta,
  );
};
export const autobaseUpdateBatteryRegistry = (batteryRegistryOld: BatteryRegistry, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetBatteryRegistry>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetBatteryRegistry(batteryRegistryOld),
    meta,
  );
};
export const autobaseRemoveBatteryRegistry = (id: BatteryRegistry['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteBatteryRegistry>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteBatteryRegistry(id),
    meta,
  );
};
