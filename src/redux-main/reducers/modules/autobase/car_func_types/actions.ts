import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  promiseLoadCarFuncTypess,
  promiseLoadPFCarFuncTypess,
  promiseCreateCarFuncTypes,
  promiseUpdateCarFuncTypes,
} from 'redux-main/reducers/modules/autobase/car_func_types/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- CarFuncTypes ---------- */
export const autobaseSetCarFuncTypes = (carFuncTypesList: CarFuncTypes[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      carFuncTypesList,
    }),
  )
);
export const autobaseResetSetCarFuncTypes = () => (dispatch) => (
  dispatch(
    autobaseSetCarFuncTypes([]),
  )
);
export const autobaseGetBlobCarFuncTypes: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFCarFuncTypess(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const autobaseGetSetCarFuncTypes: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadCarFuncTypess(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const carFuncTypesGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data } = await dispatch(
    autobaseGetSetCarFuncTypes(payload, { page, path }),
  );

  dispatch(
    autobaseSetCarFuncTypes(data),
  );

  return {
    data,
  };
};
export const autobaseCreateCarFuncTypes: any = (carFuncTypesOld: CarFuncTypes, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: carFuncTypes } = await dispatch({
    type: 'none',
    payload: promiseCreateCarFuncTypes(carFuncTypesOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return carFuncTypes;
};
export const autobaseUpdateCarFuncTypes: any = (carFuncTypesOld: CarFuncTypes, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: carFuncTypes } = await dispatch({
    type: 'none',
    payload: promiseUpdateCarFuncTypes(carFuncTypesOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return carFuncTypes;
};
