import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import {
  promiseGetCarpool,
  promiseLoadPFCarpool,
  promiseCreateCarpool,
  promiseUpdateCarpool,
  promiseRemoveCarpool,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetCarpool = (carpoolList: Carpool[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      carpoolList,
    }),
  )
);
export const geoobjectResetSetCarpool = () => (dispatch) => (
  dispatch(
    actionSetCarpool([]),
  )
);
export const actionGetBlobCarpool: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFCarpool(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetCarpool: any = (payloadOwn = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetCarpool(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreCarpool: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    actionGetGetCarpool(payload, { page, path }),
  );

  dispatch(
    actionSetCarpool(data),
  );

  return {
    carpoolList: data,
  };
};
export const actionCreateCarpool: any = (carpoolOld: Carpool, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateCarpool(carpoolOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateCarpool: any = (carpoolOld: Carpool, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateCarpool(carpoolOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveCarpool = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveCarpool(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetCarpool,
  geoobjectResetSetCarpool,
  actionGetBlobCarpool,
  actionGetGetCarpool,
  actionGetAndSetInStoreCarpool,
  actionCreateCarpool,
  actionUpdateCarpool,
  actionRemoveCarpool,
};
