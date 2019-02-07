import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import {
  promiseGetBridges,
  promiseCreateBridges,
  promiseUpdateBridges,
  promiseRemoveBridges,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/promise';

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
export const actionGetGetBridges: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetBridges(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreBridges: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
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
  actionGetGetBridges,
  actionGetAndSetInStoreBridges,
  actionCreateBridges,
  actionUpdateBridges,
  actionRemoveBridges,
};
