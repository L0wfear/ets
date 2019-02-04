import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';
import {
  promiseGetPedestrianTunnels,
  promiseLoadPFPedestrianTunnels,
  promiseCreatePedestrianTunnels,
  promiseUpdatePedestrianTunnels,
  promiseRemovePedestrianTunnels,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetPedestrianTunnels: any = (pedestrianTunnelsList: PedestrianTunnels[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      pedestrianTunnelsList,
    }),
  )
);
export const geoobjectResetSetPedestrianTunnels: any = () => (dispatch) => (
  dispatch(
    actionSetPedestrianTunnels([]),
  )
);
export const actionGetBlobPedestrianTunnels: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFPedestrianTunnels(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetPedestrianTunnels: any = (payloadOwn = {}, { page, path }: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetPedestrianTunnels(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStorePedestrianTunnels: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    actionGetGetPedestrianTunnels(payload, { page, path }),
  );

  dispatch(
    actionSetPedestrianTunnels(data),
  );

  return {
    pedestrianTunnelsList: data,
  };
};
export const actionCreatePedestrianTunnels: any = (pedestrianTunnelsOld: PedestrianTunnels, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreatePedestrianTunnels(pedestrianTunnelsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdatePedestrianTunnels: any = (pedestrianTunnelsOld: PedestrianTunnels, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdatePedestrianTunnels(pedestrianTunnelsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemovePedestrianTunnels: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemovePedestrianTunnels(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetPedestrianTunnels,
  geoobjectResetSetPedestrianTunnels,
  actionGetBlobPedestrianTunnels,
  actionGetGetPedestrianTunnels,
  actionGetAndSetInStorePedestrianTunnels,
  actionCreatePedestrianTunnels,
  actionUpdatePedestrianTunnels,
  actionRemovePedestrianTunnels,
};
