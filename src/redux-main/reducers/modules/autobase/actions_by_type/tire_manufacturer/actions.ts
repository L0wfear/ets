import { TireManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireManufacturer,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_manufacturer/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- TireManufacturer ---------- */
export const autobaseSetTireManufacturer = (tireManufacturerList: Array<TireManufacturer>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireManufacturerList,
    }),
  )
);
export const autobaseResetSetTireManufacturer = (): EtsAction<EtsActionReturnType<typeof autobaseSetTireManufacturer>> => (dispatch) => (
  dispatch(
    autobaseSetTireManufacturer([]),
  )
);
export const autobaseGetTireManufacturer = (payload: Parameters<typeof getTireManufacturer>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getTireManufacturer>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getTireManufacturer(payload),
    meta,
  )
);
export const tireManufacturerGetAndSetInStore = (...arg: Parameters<typeof autobaseGetTireManufacturer>): EtsAction<EtsActionReturnType<typeof autobaseGetTireManufacturer>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetTireManufacturer(...arg),
  );

  dispatch(
    autobaseSetTireManufacturer(result.data),
  );

  return result;
};
