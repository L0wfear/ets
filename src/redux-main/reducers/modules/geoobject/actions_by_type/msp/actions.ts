import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import {
  promiseGetMsp,
  promiseLoadPFMsp,
  promiseCreateMsp,
  promiseUpdateMsp,
  promiseRemoveMsp,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetMsp: any = (mspList: Msp[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      mspList,
    }),
  )
);
export const geoobjectResetSetMsp: any = () => (dispatch) => (
  dispatch(
    actionSetMsp([]),
  )
);
export const actionGetBlobMsp: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFMsp(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetMsp: any = (payloadOwn = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = dispatch({
    type: 'none',
    payload: promiseGetMsp(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreMsp: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    actionGetGetMsp(payload, { page, path }),
  );

  dispatch(
    actionSetMsp(data),
  );

  return {
    mspList: data,
  };
};
export const actionCreateMsp: any = (mspOld: Msp, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateMsp(mspOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateMsp: any = (mspOld: Msp, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateMsp(mspOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveMsp: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveMsp(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetMsp,
  geoobjectResetSetMsp,
  actionGetBlobMsp,
  actionGetGetMsp,
  actionGetAndSetInStoreMsp,
  actionCreateMsp,
  actionUpdateMsp,
  actionRemoveMsp,
};
