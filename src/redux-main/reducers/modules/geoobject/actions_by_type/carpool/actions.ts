import {
  promiseGetCarpool,
  promiseLoadPFCarpool,
  promiseCreateCarpool,
  promiseUpdateCarpool,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobCarpool = (payload: Parameters<typeof promiseLoadPFCarpool>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFCarpool>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFCarpool(payload),
      meta,
    ),
  );
};
export const actionGetGetCarpool = (payload: Parameters<typeof promiseGetCarpool>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetCarpool>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetCarpool(payload),
      meta,
    ),
  );
};

export const actionCreateCarpool = (payload: Parameters<typeof promiseCreateCarpool>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateCarpool>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateCarpool(payload),
      meta,
    ),
  );
};

export const actionUpdateCarpool = (payload: Parameters<typeof promiseUpdateCarpool>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateCarpool>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateCarpool(payload),
      meta,
    ),
  );
};
