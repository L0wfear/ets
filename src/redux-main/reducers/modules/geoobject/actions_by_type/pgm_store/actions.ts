import {
  promiseGetPgmStore,
  promiseLoadPFPgmStore,
  promiseCreatePgmStore,
  promiseUpdatePgmStore,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobPgmStore = (payload: Parameters<typeof promiseLoadPFPgmStore>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFPgmStore>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFPgmStore(payload),
      meta,
    ),
  );
};
export const actionGetGetPgmStore = (payload: Parameters<typeof promiseGetPgmStore>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetPgmStore>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetPgmStore(payload),
      meta,
    ),
  );
};

export const actionCreatePgmStore = (payload: Parameters<typeof promiseCreatePgmStore>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreatePgmStore>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreatePgmStore(payload),
      meta,
    ),
  );
};

export const actionUpdatePgmStore = (payload: Parameters<typeof promiseUpdatePgmStore>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdatePgmStore>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdatePgmStore(payload),
      meta,
    ),
  );
};
