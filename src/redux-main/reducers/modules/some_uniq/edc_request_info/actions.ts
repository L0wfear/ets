import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetEdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

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
export const actionGetEdcRequestInfo: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) =>
  dispatch({
    type: 'none',
    payload: promiseGetEdcRequestInfo(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreEdcRequestInfo: any = (
  payload: {id: number, original: boolean} = { id: null, original: false, },
  { page, path }: LoadingMeta,
) => async (dispatch) => {
  const {
    payload: { data },
  } = await dispatch(actionGetEdcRequestInfo(payload, { page, path }));

  dispatch(actionSetEdcRequestInfo(data));

  return {
    edcRequestInfoList: data,
  };
};

export default {
  actionSetEdcRequestInfo,
  actionResetEdcRequestInfo,
  actionGetEdcRequestInfo,
  actionGetAndSetInStoreEdcRequestInfo,
};
