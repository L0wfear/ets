import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { promiseLoadMeasureUnit } from './promise';
import { MeasureUnit } from './@types';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionSetMeasureUnit = (measureUnitList: MeasureUnit[]) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      measureUnitList,
    }),
  )
);
export const actionResetSetMeasureUnit = () => (dispatch) => (
  dispatch(
    actionSetMeasureUnit([]),
  )
);
export const actionLoadMeasureUnit: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const data = await etsLoadingCounter(
    dispatch,
    promiseLoadMeasureUnit(payload),
    { page, path },
  );

  return data;
};
export const actionmeasureUnitGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const data = await dispatch(
    actionLoadMeasureUnit(payload, { page, path }),
  );

  dispatch(
    actionSetMeasureUnit(data),
  );

  return {
    measureUnitList: data,
  };
};
