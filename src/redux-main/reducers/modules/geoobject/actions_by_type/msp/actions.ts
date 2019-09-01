import {
  promiseGetMsp,
  promiseLoadPFMsp,
  promiseCreateMsp,
  promiseUpdateMsp,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobMsp = (payload: Parameters<typeof promiseLoadPFMsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFMsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFMsp(payload),
      meta,
    ),
  );
};
export const actionGetGetMsp = (payload: Parameters<typeof promiseGetMsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetMsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetMsp(payload),
      meta,
    ),
  );
};

export const actionCreateMsp = (payload: Parameters<typeof promiseCreateMsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateMsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateMsp(payload),
      meta,
    ),
  );
};

export const actionUpdateMsp = (payload: Parameters<typeof promiseUpdateMsp>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateMsp>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateMsp(payload),
      meta,
    ),
  );
};
