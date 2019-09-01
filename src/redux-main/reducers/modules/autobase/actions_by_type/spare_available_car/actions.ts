import { SpareAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSpareAvailableCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/spare_available_car/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- SpareAvailableCar ---------- */
export const autobaseSetSpareAvailableCar = (spareAvailableCarList: SpareAvailableCar[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      spareAvailableCarList,
    }),
  )
);
export const autobaseResetSetSpareAvailableCar = (): EtsAction<EtsActionReturnType<typeof autobaseSetSpareAvailableCar>> => (dispatch) => (
  dispatch(
    autobaseSetSpareAvailableCar([]),
  )
);
export const autobaseGetSpareAvailableCar = (payload: Parameters<typeof getSpareAvailableCar>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSpareAvailableCar>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSpareAvailableCar(payload),
    meta,
  )
);
export const spareAvailableCarGetAndSetInStore = (...arg: Parameters<typeof autobaseGetSpareAvailableCar>): EtsAction<EtsActionReturnType<typeof autobaseGetSpareAvailableCar>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSpareAvailableCar(...arg),
  );

  dispatch(
    autobaseSetSpareAvailableCar(result.data),
  );

  return result;
};
