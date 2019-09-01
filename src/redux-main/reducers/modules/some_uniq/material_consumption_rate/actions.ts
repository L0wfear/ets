import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetConsumptionRateMaterial } from 'redux-main/reducers/modules/some_uniq/material_consumption_rate/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetConsumptionRateMaterial = (consumptionRateMaterialList: IStateSomeUniq['consumptionRateMaterialList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      consumptionRateMaterialList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetConsumptionRateMaterial = (): EtsAction<EtsActionReturnType<typeof actionSetConsumptionRateMaterial>> => (dispatch) => {
  return dispatch(actionSetConsumptionRateMaterial([]));
};

/* --------------- запрос --------------- */
export const actionGetConsumptionRateMaterial = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetConsumptionRateMaterial>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetConsumptionRateMaterial(payload),
    meta,
  );
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreConsumptionRateMaterial = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetConsumptionRateMaterial>> => async (dispatch) => {
  const result = await dispatch(actionGetConsumptionRateMaterial(payload, meta));

  dispatch(actionSetConsumptionRateMaterial(result.data));

  return result;
};
