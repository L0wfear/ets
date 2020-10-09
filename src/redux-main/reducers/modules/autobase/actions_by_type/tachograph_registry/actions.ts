import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographList } from './@types';
import { promiseGetTachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographList = (tachographList: Array<TachographList>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographList>> => (dispatch) => (
  dispatch(
    actionSetTachographList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographList(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographList(payload, meta),
  );

  dispatch(
    actionSetTachographList(result.data),
  );

  return result;
};
