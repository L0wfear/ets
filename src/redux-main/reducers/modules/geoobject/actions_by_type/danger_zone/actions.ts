import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import {
  promiseGetDangerZone,
  promiseLoadPFDangerZone,
  promiseCreateDangerZone,
  promiseUpdateDangerZone,
  promiseRemoveDangerZone,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetDangerZone: any = (dangerZoneList: DangerZone[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      dangerZoneList,
    }),
  )
);
export const geoobjectResetSetDangerZone: any = () => (dispatch) => (
  dispatch(
    actionSetDangerZone([]),
  )
);
export const actionGetBlobDangerZone: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFDangerZone(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetDangerZone: any = (payloadOwn = {}, { page, path }: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetDangerZone(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreDangerZone: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    actionGetGetDangerZone(payload, { page, path }),
  );

  dispatch(
    actionSetDangerZone(data),
  );

  return {
    dangerZoneList: data,
  };
};
export const actionCreateDangerZone: any = (dangerZoneOld: DangerZone, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateDangerZone(dangerZoneOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateDangerZone: any = (dangerZoneOld: DangerZone, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateDangerZone(dangerZoneOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveDangerZone: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveDangerZone(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetDangerZone,
  geoobjectResetSetDangerZone,
  actionGetBlobDangerZone,
  actionGetGetDangerZone,
  actionGetAndSetInStoreDangerZone,
  actionCreateDangerZone,
  actionUpdateDangerZone,
  actionRemoveDangerZone,
};
