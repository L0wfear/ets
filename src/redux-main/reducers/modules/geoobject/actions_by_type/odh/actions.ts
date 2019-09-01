import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import {
  promiseGetOdh,
  promiseLoadPFOdh,
  promiseCreateOdh,
  promiseUpdateOdh,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/promise';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetBlobOdh = (payload: Parameters<typeof promiseLoadPFOdh>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFOdh>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseLoadPFOdh(payload),
      meta,
    ),
  );
};
export const actionGetGetOdh = (payload: Parameters<typeof promiseGetOdh>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetOdh>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseGetOdh(payload),
      meta,
    ),
  );
};

export const actionCreateOdh = (payload: Parameters<typeof promiseCreateOdh>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateOdh>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseCreateOdh(payload),
      meta,
    ),
  );
};

export const actionUpdateOdh = (payload: Parameters<typeof promiseUpdateOdh>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateOdh>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateOdh(payload),
      meta,
    ),
  );
};

export const actionSetOdh = (odhList: Odh[]): EtsAction<EtsActionReturnType<typeof geoobjectSetNewData>> => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      odhList,
    }),
  )
);
export const geoobjectResetSetOdh = (): EtsAction<EtsActionReturnType<typeof actionSetOdh>> => (dispatch) => (
  dispatch(
    actionSetOdh([]),
  )
);

export const actionGetAndSetInStoreOdh = (payload = {}, meta: LoadingMeta): EtsAction<Promise<{ odhList: Odh[] }>> => async (dispatch) => {
  const result = await dispatch(
    actionGetGetOdh(payload, meta),
  );

  dispatch(
    actionSetOdh(result.data),
  );

  return {
    odhList: result.data,
  };
};
