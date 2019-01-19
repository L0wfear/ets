import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';
import {
  promiseGetSnowStorage,
  promiseCreateSnowStorage,
  promiseUpdateSnowStorage,
  promiseRemoveSnowStorage,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/promise';

export const actionSetSnowStorage: any = (snowStorageList: SnowStorage[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      snowStorageList,
    }),
  )
);
export const geoobjectResetSetSnowStorage: any = () => (dispatch) => (
  dispatch(
    actionSetSnowStorage([]),
  )
);
export const actionGetGetSnowStorage: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetSnowStorage(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreSnowStorage: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetGetSnowStorage(payload, { page, path }),
  );

  dispatch(
    actionSetSnowStorage(data),
  );

  return {
    snowStorageList: data,
  };
};
export const actionCreateSnowStorage: any = (snowStorageOld: SnowStorage, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateSnowStorage(snowStorageOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateSnowStorage: any = (snowStorageOld: SnowStorage, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateSnowStorage(snowStorageOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveSnowStorage: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveSnowStorage(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetSnowStorage,
  geoobjectResetSetSnowStorage,
  actionGetGetSnowStorage,
  actionGetAndSetInStoreSnowStorage,
  actionCreateSnowStorage,
  actionUpdateSnowStorage,
  actionRemoveSnowStorage,
};
