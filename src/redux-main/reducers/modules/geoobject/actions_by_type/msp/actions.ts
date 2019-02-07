import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import {
  promiseGetMsp,
  promiseCreateMsp,
  promiseUpdateMsp,
  promiseRemoveMsp,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/promise';

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
export const actionGetGetMsp: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetMsp(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreMsp: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
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
  actionGetGetMsp,
  actionGetAndSetInStoreMsp,
  actionCreateMsp,
  actionUpdateMsp,
  actionRemoveMsp,
};
