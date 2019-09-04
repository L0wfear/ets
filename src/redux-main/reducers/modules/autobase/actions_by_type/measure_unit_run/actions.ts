import { MeasureUnitRun } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getMeasureUnitRun,
} from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit_run/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- MeasureUnitRun ---------- */
export const autobaseSetMeasureUnitRun = (measureUnitRunList: MeasureUnitRun[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      measureUnitRunList,
    }),
  )
);
export const autobaseResetSetMeasureUnitRun = (): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetMeasureUnitRun([]),
  )
);

export const autobaseGetMeasureUnitRun = (payload: Parameters<typeof getMeasureUnitRun>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getMeasureUnitRun>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getMeasureUnitRun(payload),
    meta,
  )
);
export const measureUnitRunGetAndSetInStore = (...arg: Parameters<typeof autobaseGetMeasureUnitRun>): EtsAction<EtsActionReturnType<typeof autobaseGetMeasureUnitRun>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetMeasureUnitRun(...arg),
  );

  dispatch(
    autobaseSetMeasureUnitRun(result.data),
  );

  return result;
};
