import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTracksCaching } from 'redux-main/reducers/modules/some_uniq/tracks_caching/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';

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
export const actionGetTracksCaching: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) =>
  dispatch({
    type: 'none',
    payload: promiseGetTracksCaching(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTracksCaching: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) => {
  const {
    payload: { data },
  } = await dispatch(actionGetTracksCaching(payload, { page, path }));

  dispatch(actionSetTracksCaching(data));

  return {
    tracksCaching: data,
  };
};

export default {
  actionSetTracksCaching,
  actionResetTracksCaching,
  actionGetTracksCaching,
  actionGetAndSetInStoreTracksCaching,
};
