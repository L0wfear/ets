import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetConsumptionRateMaterial } from 'redux-main/reducers/modules/some_uniq/material_consumption_rate/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';

/* --------------- обновление стора --------------- */
export const actionSetConsumptionRateMaterial = (
  consumptionRateMaterialList: IStateSomeUniq['consumptionRateMaterialList'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      consumptionRateMaterialList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetConsumptionRateMaterial = (): ThunkAction<
  void,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  dispatch(actionSetConsumptionRateMaterial([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetConsumptionRateMaterial: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) =>
  dispatch({
    type: 'none',
    payload: promiseGetConsumptionRateMaterial(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreConsumptionRateMaterial: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) => {
  const {
    payload: { data },
  } = await dispatch(actionGetConsumptionRateMaterial(payload, { page, path }));

  dispatch(actionSetConsumptionRateMaterial(data));

  return {
    consumptionRateMaterialList: data,
  };
};

export default {
  actionSetConsumptionRateMaterial,
  actionResetConsumptionRateMaterial,
  actionGetConsumptionRateMaterial,
  actionGetAndSetInStoreConsumptionRateMaterial,
};
