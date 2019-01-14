import { MeasureUnit } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getMeasureUnit,
} from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/promise';

/* ---------- MeasureUnit ---------- */
export const autobaseSetMeasureUnit = (measureUnitList: MeasureUnit[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      measureUnitList,
    }),
  )
);
export const autobaseResetSetMeasureUnit = () => (dispatch) => (
  dispatch(
    autobaseSetMeasureUnit([]),
  )
);
export const autobaseGetMeasureUnit: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getMeasureUnit(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const measureUnitGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetMeasureUnit(payload, { page, path }),
  );

  dispatch(
    autobaseSetMeasureUnit(data),
  );

  return {
    measureUnitList: data,
  };
};
