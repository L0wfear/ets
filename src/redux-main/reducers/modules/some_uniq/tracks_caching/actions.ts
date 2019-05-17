import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTracksCaching } from 'redux-main/reducers/modules/some_uniq/tracks_caching/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTracksCaching = (
  tracksCaching: IStateSomeUniq['tracksCaching'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      tracksCaching,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetTracksCaching = (): ThunkAction<
  void,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  dispatch(actionSetTracksCaching(null));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetTracksCaching = (payload: Parameters<typeof promiseGetTracksCaching>[0],  meta: LoadingMeta): ThunkAction<Promise<ReturnType<typeof promiseGetTracksCaching>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetTracksCaching(payload),
    meta,
  );
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTracksCaching = (payload: Parameters<typeof actionGetTracksCaching>[0], meta: LoadingMeta): ThunkAction<Promise<ReturnType<typeof actionSetTracksCaching>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const data = await dispatch(actionGetTracksCaching(payload, meta));

  dispatch(actionSetTracksCaching(data));

  return data;
};

export default {
  actionSetTracksCaching,
  actionResetTracksCaching,
  actionGetTracksCaching,
  actionGetAndSetInStoreTracksCaching,
};
