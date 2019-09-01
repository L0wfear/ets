import {
  promiseGetSnowStorage,
  promiseLoadPFSnowStorage,
  promiseCreateSnowStorage,
  promiseUpdateSnowStorage,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobSnowStorage = (payload: Parameters<typeof promiseLoadPFSnowStorage>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFSnowStorage>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFSnowStorage(payload),
      meta,
    ),
  );
};
export const actionGetGetSnowStorage = (payload: Parameters<typeof promiseGetSnowStorage>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetSnowStorage>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetSnowStorage(payload),
      meta,
    ),
  );
};

export const actionCreateSnowStorage = (payload: Parameters<typeof promiseCreateSnowStorage>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateSnowStorage>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateSnowStorage(payload),
      meta,
    ),
  );
};

export const actionUpdateSnowStorage = (payload: Parameters<typeof promiseUpdateSnowStorage>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateSnowStorage>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateSnowStorage(payload),
      meta,
    ),
  );
};
