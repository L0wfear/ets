import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import {
  promiseGetDt,
  promiseLoadPFODt,
  promiseCreateDt,
  promiseUpdateDt,
  promiseRemoveDt,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/promise';
import { keyBy } from 'lodash';

export const actionSetDt = (dtList: Dt[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      dtList,
      dtPolys: keyBy(dtList, 'yard_id'),
    }),
  )
);
export const geoobjectResetSetDt = () => (dispatch) => (
  dispatch(
    actionSetDt([]),
  )
);
export const actionGetBlobDt: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFODt(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetDt: any = (payloadOwn = {}, { page, path }: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetDt(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreDt = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
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
  actionGetBlobDt,
  actionGetAndSetInStoreDt,
  actionCreateDt,
  actionUpdateDt,
  actionRemoveDt,
};
