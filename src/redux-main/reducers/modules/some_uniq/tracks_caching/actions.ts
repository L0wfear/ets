import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTracksCaching } from 'redux-main/reducers/modules/some_uniq/tracks_caching/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

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
export const actionResetTracksCaching = (): EtsAction<void> => async (dispatch) => {
  dispatch(actionSetTracksCaching(null));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetTracksCaching = (payload: Parameters<typeof promiseGetTracksCaching>[0],  meta: LoadingMeta): EtsAction<Promise<ReturnType<typeof promiseGetTracksCaching>>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetTracksCaching(payload),
    meta,
  );
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTracksCaching = (payload: Parameters<typeof actionGetTracksCaching>[0], meta: LoadingMeta): EtsAction<Promise<ReturnType<typeof actionSetTracksCaching>>> => async (dispatch) => {
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
