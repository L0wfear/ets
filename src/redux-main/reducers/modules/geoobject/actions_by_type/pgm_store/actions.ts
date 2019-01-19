import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import {
  promiseGetPgmStore,
  promiseCreatePgmStore,
  promiseUpdatePgmStore,
  promiseRemovePgmStore,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/promise';

export const actionSetPgmStore: any = (pgmStoreList: PgmStore[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      pgmStoreList,
    }),
  )
);
export const geoobjectResetSetPgmStore: any = () => (dispatch) => (
  dispatch(
    actionSetPgmStore([]),
  )
);
export const actionGetGetPgmStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetPgmStore(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStorePgmStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetGetPgmStore(payload, { page, path }),
  );

  dispatch(
    actionSetPgmStore(data),
  );

  return {
    pgmStoreList: data,
  };
};
export const actionCreatePgmStore: any = (pgmStoreOld: PgmStore, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreatePgmStore(pgmStoreOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdatePgmStore: any = (pgmStoreOld: PgmStore, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdatePgmStore(pgmStoreOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemovePgmStore: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemovePgmStore(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetPgmStore,
  geoobjectResetSetPgmStore,
  actionGetGetPgmStore,
  actionGetAndSetInStorePgmStore,
  actionCreatePgmStore,
  actionUpdatePgmStore,
  actionRemovePgmStore,
};
