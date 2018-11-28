import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getCars,
  updateSetCar,
} from 'redux-main/reducers/modules/autobase/car/promise';

/* ---------- Car ---------- */
export const autobaseSetCar = (carList: Car[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      carList,
    }),
  )
);
export const autobaseResetSetCar = () => (dispatch) => (
  dispatch(
    autobaseSetCar([]),
  )
);
export const autobaseGetSetCar: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getCars(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const carGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetCar(payload, { page, path }),
  );

  dispatch(
    autobaseSetCar(data),
  );

  return {
    carList: data,
  };
};
export const autobaseUpdateCar: any = (carOld: Car, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { car } } = await dispatch({
    type: 'none',
    payload: updateSetCar(carOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return car;
};
