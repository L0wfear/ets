import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import {
  getCars,
  updateSetCar,
  promiseLoadCarDrivers,
} from 'redux-main/reducers/modules/autobase/car/promise';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { CarDriversData } from './@types';

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
export const autobaseGetSetCar = (payloadOwn: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof getCars>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: getCars(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const carGetAndSetInStore = (payload = {}, meta: LoadingMeta) => async (dispatch) => {
  const { data } = await dispatch(
    autobaseGetSetCar(
      payload,
      meta,
    ),
  );

  dispatch(
    autobaseSetCar(data),
  );

  return {
    carList: data,
  };
};
export const autobaseUpdateCar: any = (carOld: Car, meta: LoadingMeta) => async (dispatch) => {
  const { payload: { car } } = await dispatch({
    type: 'none',
    payload: updateSetCar(carOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return car;
};

export const actionGetCarDrivers = (car_id: Car['asuods_id'], meta: LoadingMeta): ThunkAction<Promise<CarDriversData>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const carDriversData = await etsLoadingCounter(
    dispatch,
    promiseLoadCarDrivers(car_id),
    meta,
  );

  return carDriversData;
};
