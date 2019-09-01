import {
  promiseGetDangerZone,
  promiseLoadPFDangerZone,
  promiseCreateDangerZone,
  promiseUpdateDangerZone,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobDangerZone = (payload: Parameters<typeof promiseLoadPFDangerZone>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFDangerZone>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFDangerZone(payload),
      meta,
    ),
  );
};
export const actionGetGetDangerZone = (payload: Parameters<typeof promiseGetDangerZone>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetDangerZone>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetDangerZone(payload),
      meta,
    ),
  );
};

export const actionCreateDangerZone = (payload: Parameters<typeof promiseCreateDangerZone>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateDangerZone>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateDangerZone(payload),
      meta,
    ),
  );
};

export const actionUpdateDangerZone = (payload: Parameters<typeof promiseUpdateDangerZone>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateDangerZone>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateDangerZone(payload),
      meta,
    ),
  );
};
