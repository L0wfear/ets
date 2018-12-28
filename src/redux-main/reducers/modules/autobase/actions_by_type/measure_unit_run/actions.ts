import { MeasureUnitRun } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getMeasureUnitRun,
} from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit_run/promise';

/* ---------- MeasureUnitRun ---------- */
export const autobaseSetMeasureUnitRun = (measureUnitRunList: MeasureUnitRun[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      measureUnitRunList,
    }),
  )
);
export const autobaseResetSetMeasureUnitRun = () => (dispatch) => (
  dispatch(
    autobaseSetMeasureUnitRun([]),
  )
);
export const autobaseGetMeasureUnitRun: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getMeasureUnitRun(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const measureUnitRunGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetMeasureUnitRun(payload, { page, path }),
  );

  dispatch(
    autobaseSetMeasureUnitRun(data),
  );

  return {
    measureUnitRunList: data,
  };
};
