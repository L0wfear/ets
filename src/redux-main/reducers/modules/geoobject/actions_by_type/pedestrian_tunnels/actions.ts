import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';
import {
  promiseGetPedestrianTunnels,
  promiseCreatePedestrianTunnels,
  promiseUpdatePedestrianTunnels,
  promiseRemovePedestrianTunnels,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/promise';

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
export const actionGetGetPedestrianTunnels: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetPedestrianTunnels(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStorePedestrianTunnels: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
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
  actionGetGetPedestrianTunnels,
  actionGetAndSetInStorePedestrianTunnels,
  actionCreatePedestrianTunnels,
  actionUpdatePedestrianTunnels,
  actionRemovePedestrianTunnels,
};
