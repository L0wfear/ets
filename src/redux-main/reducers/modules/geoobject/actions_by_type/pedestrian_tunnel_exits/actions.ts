import {
  promiseGetPedestrianTunnelExits,
  promiseLoadPFPedestrianTunnelExits,
  promiseCreatePedestrianTunnelExits,
  promiseUpdatePedestrianTunnelExits,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobPedestrianTunnelExits = (payload: Parameters<typeof promiseLoadPFPedestrianTunnelExits>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFPedestrianTunnelExits>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFPedestrianTunnelExits(payload),
      meta,
    ),
  );
};
export const actionGetGetPedestrianTunnelExits = (payload: Parameters<typeof promiseGetPedestrianTunnelExits>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetPedestrianTunnelExits>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetPedestrianTunnelExits(payload),
      meta,
    ),
  );
};

export const actionCreatePedestrianTunnelExits = (payload: Parameters<typeof promiseCreatePedestrianTunnelExits>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreatePedestrianTunnelExits>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreatePedestrianTunnelExits(payload),
      meta,
    ),
  );
};

export const actionUpdatePedestrianTunnelExits = (payload: Parameters<typeof promiseUpdatePedestrianTunnelExits>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdatePedestrianTunnelExits>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdatePedestrianTunnelExits(payload),
      meta,
    ),
  );
};
