import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import {
  promiseGetPedestrianTunnelExits,
  promiseCreatePedestrianTunnelExits,
  promiseUpdatePedestrianTunnelExits,
  promiseRemovePedestrianTunnelExits,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/promise';

export const actionSetPedestrianTunnelExits: any = (pedestrianTunnelExitsList: PedestrianTunnelExits[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      pedestrianTunnelExitsList,
    }),
  )
);
export const geoobjectResetSetPedestrianTunnelExits: any = () => (dispatch) => (
  dispatch(
    actionSetPedestrianTunnelExits([]),
  )
);
export const actionGetGetPedestrianTunnelExits: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetPedestrianTunnelExits(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStorePedestrianTunnelExits: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetGetPedestrianTunnelExits(payload, { page, path }),
  );

  dispatch(
    actionSetPedestrianTunnelExits(data),
  );

  return {
    pedestrianTunnelExitsList: data,
  };
};
export const actionCreatePedestrianTunnelExits: any = (pedestrianTunnelExitsOld: PedestrianTunnelExits, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreatePedestrianTunnelExits(pedestrianTunnelExitsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdatePedestrianTunnelExits: any = (pedestrianTunnelExitsOld: PedestrianTunnelExits, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdatePedestrianTunnelExits(pedestrianTunnelExitsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemovePedestrianTunnelExits: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemovePedestrianTunnelExits(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetPedestrianTunnelExits,
  geoobjectResetSetPedestrianTunnelExits,
  actionGetGetPedestrianTunnelExits,
  actionGetAndSetInStorePedestrianTunnelExits,
  actionCreatePedestrianTunnelExits,
  actionUpdatePedestrianTunnelExits,
  actionRemovePedestrianTunnelExits,
};
