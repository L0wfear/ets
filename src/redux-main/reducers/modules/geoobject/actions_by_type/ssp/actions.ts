import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import {
  promiseGetSsp,
  promiseLoadPFSsp,
  promiseCreateSsp,
  promiseUpdateSsp,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/promise';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobSsp = (payload: Parameters<typeof promiseLoadPFSsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFSsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFSsp(payload),
      meta,
    ),
  );
};
export const actionGetGetSsp = (payload: Parameters<typeof promiseGetSsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetSsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetSsp(payload),
      meta,
    ),
  );
};

export const actionCreateSsp = (payload: Parameters<typeof promiseCreateSsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateSsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateSsp(payload),
      meta,
    ),
  );
};

export const actionUpdateSsp = (payload: Parameters<typeof promiseUpdateSsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateSsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateSsp(payload),
      meta,
    ),
  );
};
