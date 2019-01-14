import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getCarFuncTypess,
  createSetCarFuncTypes,
  updateSetCarFuncTypes,
} from 'redux-main/reducers/modules/autobase/car_func_types/promise';

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
export const autobaseGetSetCarFuncTypes: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getCarFuncTypess(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const carFuncTypesGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetCarFuncTypes(payload, { page, path }),
  );

  dispatch(
    autobaseSetCarFuncTypes(data),
  );

  return {
    carFuncTypesList: data,
  };
};
export const autobaseCreateCarFuncTypes: any = (carFuncTypesOld: CarFuncTypes, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { carFuncTypes } } = await dispatch({
    type: 'none',
    payload: createSetCarFuncTypes(carFuncTypesOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return carFuncTypes;
};
export const autobaseUpdateCarFuncTypes: any = (carFuncTypesOld: CarFuncTypes, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { carFuncTypes } } = await dispatch({
    type: 'none',
    payload: updateSetCarFuncTypes(carFuncTypesOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return carFuncTypes;
};
