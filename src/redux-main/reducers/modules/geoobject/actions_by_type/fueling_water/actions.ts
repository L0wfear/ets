import {
  promiseGetFuelingWater,
  promiseLoadPFFuelingWater,
  promiseCreateFuelingWater,
  promiseUpdateFuelingWater,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobFuelingWater = (payload: Parameters<typeof promiseLoadPFFuelingWater>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFFuelingWater>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFFuelingWater(payload),
      meta,
    ),
  );
};
export const actionGetGetFuelingWater = (payload: Parameters<typeof promiseGetFuelingWater>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetFuelingWater>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetFuelingWater(payload),
      meta,
    ),
  );
};

export const actionCreateFuelingWater = (payload: Parameters<typeof promiseCreateFuelingWater>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateFuelingWater>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateFuelingWater(payload),
      meta,
    ),
  );
};

export const actionUpdateFuelingWater = (payload: Parameters<typeof promiseUpdateFuelingWater>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateFuelingWater>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateFuelingWater(payload),
      meta,
    ),
  );
};
