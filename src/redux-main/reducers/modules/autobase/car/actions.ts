import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import {
  getCars,
  promiseLoadCarDrivers,
  promiseLoadCarRegistration,
  promiseLoadCarPassport,
  promiseUpdateCar,
  promiseUpdateCarDriversData,
  promiseUpdateCarRegistrationData,
  promiseUpdateCarPassportData,
} from 'redux-main/reducers/modules/autobase/car/promise';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { CarDriversData, CarRegistrationData, CarPassporntData } from './@types';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

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

export const actionUpdateCar = (car: Car, meta: LoadingMeta): ThunkAction<Promise<Car>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCar(car),
    meta,
  );

  return response;
};

export const actionUpdateCarWrap: any = (carWrapOld: CarWrap, meta: LoadingMeta) => async (dispatch) => {
  const {
    drivers_data,
    registration_data,
    passport_data,
    ...car
  } = carWrapOld;

  await Promise.all([
    dispatch(
      actionUpdateCar(car, meta),
    ),
    dispatch(
      actionUpdateCarDrivers(drivers_data, meta),
    ),
    dispatch(
      actionUpdateCarRegistration(registration_data, meta),
    ),
    dispatch(
      actionUpdateCarPassport(passport_data, meta),
    ),
  ]);

  return carWrapOld;
};

export const actionUpdateCarDrivers = (driversData: CarDriversData, meta: LoadingMeta): ThunkAction<Promise<CarDriversData>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCarDriversData(driversData),
    meta,
  );

  return response;
};

export const actionGetCarDrivers = (car_id: Car['asuods_id'], meta: LoadingMeta): ThunkAction<Promise<CarDriversData>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const carDriversData = await etsLoadingCounter(
    dispatch,
    promiseLoadCarDrivers(car_id),
    meta,
  );

  return carDriversData;
};

export const actionUpdateCarRegistration = (registrationData: CarRegistrationData, meta: LoadingMeta): ThunkAction<Promise<CarRegistrationData>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCarRegistrationData(registrationData),
    meta,
  );

  return response;
};

export const actionLoadCarRegistration = (car_id: Car['asuods_id'], meta: LoadingMeta): ThunkAction<Promise<CarRegistrationData>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const carDriversData = await etsLoadingCounter(
    dispatch,
    promiseLoadCarRegistration(car_id),
    meta,
  );

  return carDriversData;
};

export const actionUpdateCarPassport = (passportData: CarPassporntData, meta: LoadingMeta): ThunkAction<Promise<CarPassporntData>, ReduxState, {}, AnyAction> => async (dispatch) => {
  if (!passportData.type) {                             // нет типа - нет обновления
    return Promise.resolve(passportData);
  }

  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCarPassportData(passportData),
    meta,
  );

  return response;
};

export const actionLoadCarPassport = (car_id: Car['asuods_id'], meta: LoadingMeta): ThunkAction<Promise<CarPassporntData>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const carDriversData = await etsLoadingCounter(
    dispatch,
    promiseLoadCarPassport(car_id),
    meta,
  );

  return carDriversData;
};
