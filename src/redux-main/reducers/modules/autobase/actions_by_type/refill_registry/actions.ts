import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { Refill } from './@types';
import { promiseGetRefillList } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetRefillList = (refillList: Array<Refill>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      refillList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetRefillList = (): EtsAction<EtsActionReturnType<typeof actionSetRefillList>> => (dispatch) => (
  dispatch(
    actionSetRefillList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetRefillList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetRefillList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetRefillList(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreRefillList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetRefillList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetRefillList(payload, meta),
  );

  dispatch(
    actionSetRefillList(result.data),
  );

  return result;
};