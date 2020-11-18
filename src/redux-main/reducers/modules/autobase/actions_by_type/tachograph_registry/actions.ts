import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographList } from './@types';
import { 
  promiseGetTachographList,
  promiseCreateTachograph,
  promiseDeleteTachograph,
  promiseUpdateTachograph, 
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/promise';
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

export const actionCreateTachograph = (
  payload: TachographList,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseCreateTachograph>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseCreateTachograph(payload), meta);
};

export const actionUpdateTachograph = (
  payload: TachographList,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseUpdateTachograph>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseUpdateTachograph(payload), meta);
};

export const actionDeleteTachograph = (
  id: number,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseDeleteTachograph>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseDeleteTachograph(id), meta);
};

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
