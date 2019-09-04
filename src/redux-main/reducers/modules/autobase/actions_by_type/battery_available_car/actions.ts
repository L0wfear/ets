import { BatteryAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getBatteryAvailableCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_available_car/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- BatteryAvailableCar ---------- */
export const autobaseSetBatteryAvailableCar = (batteryAvailableCarList: BatteryAvailableCar[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryAvailableCarList,
    }),
  )
);
export const autobaseResetSetBatteryAvailableCar = (): EtsAction<EtsActionReturnType<typeof autobaseSetBatteryAvailableCar>> => (dispatch) => (
  dispatch(
    autobaseSetBatteryAvailableCar([]),
  )
);
export const autobaseGetBatteryAvailableCar = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getBatteryAvailableCar>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getBatteryAvailableCar(payload),
    meta,
  )
);
export const batteryAvailableCarGetAndSetInStore = (...arg: Parameters<typeof autobaseGetBatteryAvailableCar>): EtsAction<EtsActionReturnType<typeof autobaseGetBatteryAvailableCar>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetBatteryAvailableCar(...arg),
  );

  dispatch(
    autobaseSetBatteryAvailableCar(result.data),
  );

  return result;
};
