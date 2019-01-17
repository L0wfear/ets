import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import {
  promiseGetFuelingWater,
  promiseCreateFuelingWater,
  promiseUpdateFuelingWater,
  promiseRemoveFuelingWater,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/promise';

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
export const actionGetGetFuelingWater: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetFuelingWater(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreFuelingWater: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
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
  actionGetGetFuelingWater,
  actionGetAndSetInStoreFuelingWater,
  actionCreateFuelingWater,
  actionUpdateFuelingWater,
  actionRemoveFuelingWater,
};
