import {
  promiseGetPedestrianTunnels,
  promiseLoadPFPedestrianTunnels,
  promiseCreatePedestrianTunnels,
  promiseUpdatePedestrianTunnels,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobPedestrianTunnels = (payload: Parameters<typeof promiseLoadPFPedestrianTunnels>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFPedestrianTunnels>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFPedestrianTunnels(payload),
      meta,
    ),
  );
};
export const actionGetGetPedestrianTunnels = (payload: Parameters<typeof promiseGetPedestrianTunnels>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetPedestrianTunnels>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetPedestrianTunnels(payload),
      meta,
    ),
  );
};

export const actionCreatePedestrianTunnels = (payload: Parameters<typeof promiseCreatePedestrianTunnels>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreatePedestrianTunnels>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreatePedestrianTunnels(payload),
      meta,
    ),
  );
};

export const actionUpdatePedestrianTunnels = (payload: Parameters<typeof promiseUpdatePedestrianTunnels>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdatePedestrianTunnels>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdatePedestrianTunnels(payload),
      meta,
    ),
  );
};
