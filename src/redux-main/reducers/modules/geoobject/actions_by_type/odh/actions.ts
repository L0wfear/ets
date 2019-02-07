import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import {
  promiseGetOdh,
  promiseCreateOdh,
  promiseUpdateOdh,
  promiseRemoveOdh,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/promise';

export const actionSetOdh = (odhList: Odh[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      odhList,
    }),
  )
);
export const geoobjectResetSetOdh = () => (dispatch) => (
  dispatch(
    actionSetOdh([]),
  )
);
export const actionGetGetOdh: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetOdh(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreOdh = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetGetOdh(payload, { page, path }),
  );

  dispatch(
    actionSetOdh(data),
  );

  return {
    odhList: data,
  };
};
export const actionCreateOdh: any = (odhOld: Odh, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateOdh(odhOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateOdh: any = (odhOld: Odh, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateOdh(odhOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveOdh = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveOdh(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetOdh,
  geoobjectResetSetOdh,
  actionGetGetOdh,
  actionGetAndSetInStoreOdh,
  actionCreateOdh,
  actionUpdateOdh,
  actionRemoveOdh,
};
