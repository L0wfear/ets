import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import {
  promiseGetFuelingWater,
  promiseLoadPFFuelingWater,
  promiseCreateFuelingWater,
  promiseUpdateFuelingWater,
  promiseRemoveFuelingWater,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetFuelingWater: any = (fuelingWaterList: FuelingWater[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      fuelingWaterList,
    }),
  )
);
export const geoobjectResetSetFuelingWater: any = () => (dispatch) => (
  dispatch(
    actionSetFuelingWater([]),
  )
);
export const actionGetBlobFuelingWater: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFFuelingWater(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetFuelingWater: any = (payloadOwn = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetFuelingWater(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreFuelingWater: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    actionGetGetFuelingWater(payload, { page, path }),
  );

  dispatch(
    actionSetFuelingWater(data),
  );

  return {
    fuelingWaterList: data,
  };
};
export const actionCreateFuelingWater: any = (fuelingWaterOld: FuelingWater, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateFuelingWater(fuelingWaterOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateFuelingWater: any = (fuelingWaterOld: FuelingWater, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateFuelingWater(fuelingWaterOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveFuelingWater: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveFuelingWater(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetFuelingWater,
  geoobjectResetSetFuelingWater,
  actionGetBlobFuelingWater,
  actionGetGetFuelingWater,
  actionGetAndSetInStoreFuelingWater,
  actionCreateFuelingWater,
  actionUpdateFuelingWater,
  actionRemoveFuelingWater,
};
