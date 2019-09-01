import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import {
  promiseGetDt,
  promiseLoadPFDt,
  promiseCreateDt,
  promiseUpdateDt,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/promise';
import { keyBy } from 'lodash';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobDt = (payload: Parameters<typeof promiseLoadPFDt>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFDt>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFDt(payload),
      meta,
    ),
  );
};
export const actionGetGetDt = (payload: Parameters<typeof promiseGetDt>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetDt>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetDt(payload),
      meta,
    ),
  );
};

export const actionCreateDt = (payload: Parameters<typeof promiseCreateDt>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateDt>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateDt(payload),
      meta,
    ),
  );
};

export const actionUpdateDt = (payload: Parameters<typeof promiseUpdateDt>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateDt>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateDt(payload),
      meta,
    ),
  );
};
export const actionSetDt = (dtList: Dt[]): EtsAction<EtsActionReturnType<typeof geoobjectSetNewData>> => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      dtList,
      dtPolys: keyBy(dtList, 'yard_id'),
    }),
  )
);
export const geoobjectResetSetDt = (): EtsAction<EtsActionReturnType<typeof actionSetDt>> => (dispatch) => (
  dispatch(
    actionSetDt([]),
  )
);

export const actionGetAndSetInStoreDt = (payload = {}, meta: LoadingMeta): EtsAction<Promise<{ dtList: Dt[] }>> => async (dispatch) => {
  const result = await dispatch(
    actionGetGetDt(payload, meta),
  );

  dispatch(
    actionSetDt(result.data),
  );

  return {
    dtList: result.data,
  };
};
