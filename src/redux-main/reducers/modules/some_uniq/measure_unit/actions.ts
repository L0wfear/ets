import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { promiseLoadMeasureUnit } from './promise';
import { MeasureUnit } from './@types';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetMeasureUnit = (measureUnitList: MeasureUnit[]): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      measureUnitList,
    }),
  )
);
export const actionResetSetMeasureUnit = (): EtsAction<EtsActionReturnType<typeof actionSetMeasureUnit>> => (dispatch) => (
  dispatch(
    actionSetMeasureUnit([]),
  )
);
export const actionLoadMeasureUnit = (payload: Parameters<typeof promiseLoadMeasureUnit>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadMeasureUnit>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadMeasureUnit(payload),
    meta,
  );
};

export const actionMeasureUnitGetAndSetInStore = (...arg: Parameters<typeof actionLoadMeasureUnit>): EtsAction<EtsActionReturnType<typeof actionLoadMeasureUnit>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadMeasureUnit(...arg),
  );

  dispatch(
    actionSetMeasureUnit(result.data),
  );

  return result;
};
