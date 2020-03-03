import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetEdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetEdcRequestInfo = (
  edcRequestInfoList: IStateSomeUniq['edcRequestInfoList'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      edcRequestInfoList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetEdcRequestInfo = (): EtsAction<void> => async (dispatch) => {
  dispatch(actionSetEdcRequestInfo([]));

  return [];
};

/* --------------- запрос --------------- */
export const actionGetEdcRequestInfo = (payload: any, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetEdcRequestInfo>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetEdcRequestInfo(payload),
    meta,
  );
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreEdcRequestInfo = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetEdcRequestInfo>> => async (dispatch) => {
  const result = await dispatch(actionGetEdcRequestInfo(payload, meta));

  dispatch(actionSetEdcRequestInfo(result.data));

  return result;
};
