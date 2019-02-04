import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import {
  promiseGetBridges,
  promiseLoadPFBridges,
  promiseCreateBridges,
  promiseUpdateBridges,
  promiseRemoveBridges,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetBridges: any = (bridgesList: Bridges[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      bridgesList,
    }),
  )
);
export const geoobjectResetSetBridges: any = () => (dispatch) => (
  dispatch(
    actionSetBridges([]),
  )
);
export const actionGetBlobBridges: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFBridges(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetBridges: any = (payloadOwn = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetBridges(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreBridges: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    actionGetGetBridges(payload, { page, path }),
  );

  dispatch(
    actionSetBridges(data),
  );

  return {
    bridgesList: data,
  };
};
export const actionCreateBridges: any = (bridgesOld: Bridges, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateBridges(bridgesOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateBridges: any = (bridgesOld: Bridges, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateBridges(bridgesOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveBridges: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveBridges(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetBridges,
  geoobjectResetSetBridges,
  actionGetBlobBridges,
  actionGetGetBridges,
  actionGetAndSetInStoreBridges,
  actionCreateBridges,
  actionUpdateBridges,
  actionRemoveBridges,
};
