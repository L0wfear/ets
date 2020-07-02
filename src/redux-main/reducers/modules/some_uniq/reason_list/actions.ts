import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetReasonList } from 'redux-main/reducers/modules/some_uniq/reason_list/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetReasonList = (reasonList: IStateSomeUniq['reasonList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      reasonList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetReasonList = (): EtsAction<EtsActionReturnType<typeof actionSetReasonList>> => (dispatch) => (
  dispatch(
    actionSetReasonList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetReasonList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetReasonList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetReasonList(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreReasonList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetReasonList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetReasonList(payload, meta),
  );

  dispatch(
    actionSetReasonList(result.data),
  );

  return result;
};
