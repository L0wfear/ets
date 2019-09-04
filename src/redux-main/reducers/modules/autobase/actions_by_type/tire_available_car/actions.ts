import { TireAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireAvailableCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_available_car/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- TireAvailableCar ---------- */
export const autobaseSetTireAvailableCar = (tireAvailableCarList: TireAvailableCar[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireAvailableCarList,
    }),
  )
);
export const autobaseResetSetTireAvailableCar = (): EtsAction<EtsActionReturnType<typeof autobaseSetTireAvailableCar>> => (dispatch) => (
  dispatch(
    autobaseSetTireAvailableCar([]),
  )
);
export const autobaseGetTireAvailableCar = (payload: Parameters<typeof getTireAvailableCar>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getTireAvailableCar>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getTireAvailableCar(payload),
    meta,
  )
);
export const tireAvailableCarGetAndSetInStore = (...arg: Parameters<typeof autobaseGetTireAvailableCar>): EtsAction<EtsActionReturnType<typeof autobaseGetTireAvailableCar>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetTireAvailableCar(...arg),
  );

  dispatch(
    autobaseSetTireAvailableCar(result.data),
  );

  return result;
};
