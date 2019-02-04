import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import {
  promiseGetFountains,
  promiseLoadPFFountains,
  promiseCreateFountains,
  promiseUpdateFountains,
  promiseRemoveFountains,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetFountains: any = (fountainsList: Fountains[]) => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      fountainsList,
    }),
  )
);
export const geoobjectResetSetFountains: any = () => (dispatch) => (
  dispatch(
    actionSetFountains([]),
  )
);
export const actionGetBlobFountains: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFFountains(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetGetFountains: any = (payloadOwn = {}, { page, path }: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetFountains(payloadOwn),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreFountains: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    actionGetGetFountains(payload, { page, path }),
  );

  dispatch(
    actionSetFountains(data),
  );

  return {
    fountainsList: data,
  };
};
export const actionCreateFountains: any = (fountainsOld: Fountains, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateFountains(fountainsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionUpdateFountains: any = (fountainsOld: Fountains, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateFountains(fountainsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};
export const actionRemoveFountains: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseRemoveFountains(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export default {
  actionSetFountains,
  geoobjectResetSetFountains,
  actionGetBlobFountains,
  actionGetGetFountains,
  actionGetAndSetInStoreFountains,
  actionCreateFountains,
  actionUpdateFountains,
  actionRemoveFountains,
};
