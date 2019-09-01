import {
  promiseGetFountains,
  promiseLoadPFFountains,
  promiseCreateFountains,
  promiseUpdateFountains,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobFountains = (payload: Parameters<typeof promiseLoadPFFountains>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFFountains>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFFountains(payload),
      meta,
    ),
  );
};
export const actionGetGetFountains = (payload: Parameters<typeof promiseGetFountains>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetFountains>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetFountains(payload),
      meta,
    ),
  );
};

export const actionCreateFountains = (payload: Parameters<typeof promiseCreateFountains>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateFountains>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateFountains(payload),
      meta,
    ),
  );
};

export const actionUpdateFountains = (payload: Parameters<typeof promiseUpdateFountains>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateFountains>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateFountains(payload),
      meta,
    ),
  );
};
