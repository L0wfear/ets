import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import {
  promiseGetDt,
  promiseCreateDt,
  promiseUpdateDt,
  promiseRemoveDt,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/promise';

export const actionSetDt = (dtList: Dt[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      dtList,
    }),
  )
);
export const geoobjectResetSetDt = () => (dispatch) => (
  dispatch(
    actionSetDt([]),
  )
);
export const actionGetGetDt: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetDt(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreDt = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetGetDt(payload, { page, path }),
  );

  dispatch(
    actionSetDt(data),
  );

  return {
    dtList: data,
  };
};
export const actionCreateDt: any = (dtOld: Dt, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateDt(dtOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateDt: any = (dtOld: Dt, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateDt(dtOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveDt = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveDt(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetDt,
  geoobjectResetSetDt,
  actionGetGetDt,
  actionGetAndSetInStoreDt,
  actionCreateDt,
  actionUpdateDt,
  actionRemoveDt,
};
