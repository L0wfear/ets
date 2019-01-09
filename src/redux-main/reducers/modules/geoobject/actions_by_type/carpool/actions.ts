import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import {
  promiseGetCarpool,
  promiseCreateCarpool,
  promiseUpdateCarpool,
  promiseRemoveCarpool,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/promise';

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
export const actionGetGetCarpool: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetCarpool(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreCarpool = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
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
  actionGetGetCarpool,
  actionGetAndSetInStoreCarpool,
  actionCreateCarpool,
  actionUpdateCarpool,
  actionRemoveCarpool,
};
