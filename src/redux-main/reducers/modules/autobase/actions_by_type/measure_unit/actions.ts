import { MeasureUnit } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getMeasureUnit,
} from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- MeasureUnit ---------- */
export const autobaseSetMeasureUnit = (measureUnitList: Array<MeasureUnit>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      measureUnitList,
    }),
  )
);
export const autobaseResetSetMeasureUnit = (): EtsAction<EtsActionReturnType<typeof autobaseSetMeasureUnit>> => (dispatch) => (
  dispatch(
    autobaseSetMeasureUnit([]),
  )
);
export const autobaseGetMeasureUnit = (payload: Parameters<typeof getMeasureUnit>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getMeasureUnit>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getMeasureUnit(payload),
    meta,
  )
);
export const measureUnitGetAndSetInStore = (...arg: Parameters<typeof autobaseGetMeasureUnit>): EtsAction<EtsActionReturnType<typeof autobaseGetMeasureUnit>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetMeasureUnit(...arg),
  );

  dispatch(
    autobaseSetMeasureUnit(result.data),
  );

  return result;
};
