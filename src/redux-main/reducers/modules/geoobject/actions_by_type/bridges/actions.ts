import {
  promiseGetBridges,
  promiseLoadPFBridges,
  promiseCreateBridges,
  promiseUpdateBridges,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobBridges = (payload: Parameters<typeof promiseLoadPFBridges>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFBridges>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFBridges(payload),
      meta,
    ),
  );
};
export const actionGetGetBridges = (payload: Parameters<typeof promiseGetBridges>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetBridges>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetBridges(payload),
      meta,
    ),
  );
};

export const actionCreateBridges = (payload: Parameters<typeof promiseCreateBridges>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateBridges>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateBridges(payload),
      meta,
    ),
  );
};

export const actionUpdateBridges = (payload: Parameters<typeof promiseUpdateBridges>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateBridges>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateBridges(payload),
      meta,
    ),
  );
};
