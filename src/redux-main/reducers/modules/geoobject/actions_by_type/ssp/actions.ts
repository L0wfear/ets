import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import {
  promiseGetSsp,
  promiseCreateSsp,
  promiseUpdateSsp,
  promiseRemoveSsp,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/promise';

export const actionSetSsp = (sspList: Ssp[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      sspList,
    }),
  )
);
export const geoobjectResetSetSsp = () => (dispatch) => (
  dispatch(
    actionSetSsp([]),
  )
);
export const actionGetGetSsp: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetSsp(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreSsp = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetGetSsp(payload, { page, path }),
  );

  dispatch(
    actionSetSsp(data),
  );

  return {
    sspList: data,
  };
};
export const actionCreateSsp: any = (sspOld: Ssp, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateSsp(sspOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateSsp: any = (sspOld: Ssp, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateSsp(sspOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveSsp = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveSsp(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetSsp,
  geoobjectResetSetSsp,
  actionGetGetSsp,
  actionGetAndSetInStoreSsp,
  actionCreateSsp,
  actionUpdateSsp,
  actionRemoveSsp,
};
