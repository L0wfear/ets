import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetEngineKind } from 'redux-main/reducers/modules/some_uniq/engine_kind/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetEngineKind = (engineKindList: IStateSomeUniq['engineKindList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      engineKindList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetEngineKind = (): EtsAction<EtsActionReturnType<typeof actionSetEngineKind>> => (dispatch) => {
  dispatch(actionSetEngineKind([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetEngineKind = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetEngineKind>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetEngineKind(payload),
    meta,
  );
};
/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreEngineKind = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetEngineKind>> => async (dispatch) => {
  const result = await dispatch(actionGetEngineKind(payload, meta));

  dispatch(actionSetEngineKind(result.data));

  return result;
};
