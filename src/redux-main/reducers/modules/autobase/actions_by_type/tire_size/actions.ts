import { TireSize } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireSize,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_size/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- TireSize ---------- */
export const autobaseSetTireSize = (tireSizeList: Array<TireSize>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireSizeList,
    }),
  )
);
export const autobaseResetSetTireSize = (): EtsAction<EtsActionReturnType<typeof autobaseSetTireSize>> => (dispatch) => (
  dispatch(
    autobaseSetTireSize([]),
  )
);
export const autobaseGetTireSize = (payload: Parameters<typeof getTireSize>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getTireSize>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getTireSize(payload),
    meta,
  )
);
export const tireSizeGetAndSetInStore = (...arg: Parameters<typeof autobaseGetTireSize>): EtsAction<EtsActionReturnType<typeof autobaseGetTireSize>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetTireSize(...arg),
  );

  dispatch(
    autobaseSetTireSize(result.data),
  );

  return result;
};
