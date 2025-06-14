import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import {
  getCars,
  promiseLoadCarDrivers,
  promiseLoadCarRegistration,
  promiseLoadCarPassport,
  promiseUpdateCar,
  promiseUpdateCarDriversData,
  promiseUpdateCarRegistrationData,
  promiseUpdateCarPassportData,
  promiseLoadCarByAsuodsId,
  promiseGetCarMissionsAndWaybillsByTimestamp,
  promisePrintCarActualFile,
} from 'redux-main/reducers/modules/autobase/car/promise';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { CarDriversData, CarRegistrationData, CarPassporntData } from './@types';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import { getDefaultCarElement } from 'components/new/pages/nsi/autobase/pages/car_actual/form/utils';
import { employeeEmployeeGetSetEmployee } from '../../employee/employee/actions';

/* ---------- Car ---------- */
export const autobaseSetCar = (carList: Array<Car>, carIndex: Record<Car['asuods_id'], Car>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      carList,
      carIndex,
    }),
  )
);
export const autobaseResetSetCar = (): EtsAction<EtsActionReturnType<typeof autobaseSetCar>> => (dispatch) => (
  dispatch(
    autobaseSetCar([], {}),
  )
);
export const autobaseGetSetCar = (payloadOwn: object, meta: LoadingMeta): EtsAction<ReturnType<typeof getCars>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    getCars(payloadOwn),
    meta,
  );

  return result;
};
export const carGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetCar>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetCar(
      payload,
      meta,
    ),
  );

  dispatch(
    autobaseSetCar(result.data, result.dataIndex),
  );

  return result;
};

export const actionsGetCarFormDataByAsuodsId = (asuods_id: Car['asuods_id'], meta: LoadingMeta): EtsAction<Promise<CarWrap>> => async (dispatch) => {
  const response = await Promise.all([
    dispatch(
      actionsGetCarByAsuodsId(asuods_id, meta),
    ),
    dispatch(
      actionGetCarDrivers(asuods_id, meta),
    ),
    dispatch(
      actionLoadCarRegistration(asuods_id, meta),
    ),
    dispatch(
      actionLoadCarPassport(asuods_id, meta),
    ),
    dispatch(
      employeeEmployeeGetSetEmployee({}, meta)
    )
  ]);

  const [
    carData,
    carDriversData,
    carRegistrationData,
    carPassportData,
    employeeData
  ] = response;

  if (!carData) {
    return null;
  }

  const defaultCarWrapData = getDefaultCarElement(null);

  const fullCarData: CarWrap = {
    ...carData,
    asuods_id,
    drivers_data: carDriversData,
    registration_data: {
      ...defaultCarWrapData.registration_data,
      car_id: asuods_id,
      passport_data_type: defaultCarWrapData.passport_data.type,
    },
    passport_data: {
      ...defaultCarWrapData.passport_data,
      car_id: asuods_id,
    },
    employee_data: employeeData,
  };

  if (carRegistrationData) {
    fullCarData.registration_data = {
      ...fullCarData.registration_data,
      ...carRegistrationData,
      passport_data_type: carPassportData?.type,
    };
  }
  if (carPassportData) {
    fullCarData.passport_data = {
      ...fullCarData.passport_data,
      ...carPassportData,
    };
  }

  return fullCarData;
};

export const actionsGetCarByAsuodsId = (asuods_id: Car['asuods_id'], meta: LoadingMeta): EtsAction<Promise<Car>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseLoadCarByAsuodsId(asuods_id),
    meta,
  );

  return response;
};

export const actionUpdateCar = (car: Car, meta: LoadingMeta): EtsAction<Promise<Car>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCar(car),
    meta,
  );

  return response;
};

export const actionUpdateCarWrap = (carWrapOld: CarWrap, meta: LoadingMeta): EtsAction<Promise<CarWrap>> => async (dispatch) => {
  const {
    drivers_data,
    registration_data,
    passport_data,
    ...car
  } = carWrapOld;

  const copyCar = { ...car };
  delete copyCar.employee_data;

  await dispatch(
    actionUpdateCar(copyCar, meta),
  ).then(() => {
    dispatch(
      actionUpdateCarDrivers(drivers_data, meta),
    ).catch((e) => {
      console.error(e);
    });
  });

  const carPassportData = await dispatch(
    actionUpdateCarPassport(passport_data, meta),
  )
    .then((result) => result)
    .catch((e) => {
      console.error(e);
    });

  const registrationData = await dispatch(
    actionUpdateCarRegistration(registration_data, meta),
  )
    .then((result) => result)
    .catch((e) => {
      console.error(e);
    });

  const fullCarData: CarWrap = {
    ...carWrapOld,
    registration_data: {
      ...carWrapOld.registration_data,
    },
    passport_data: {
      ...carWrapOld.passport_data,
    },
  };

  if (registrationData) {
    fullCarData.registration_data = {
      ...fullCarData.registration_data,
      ...registrationData,
    };
  }
  if (carPassportData) {
    fullCarData.passport_data = {
      ...fullCarData.passport_data,
      ...carPassportData,
    };
  }

  return fullCarData;
};

export const actionUpdateCarDrivers = (driversData: CarDriversData, meta: LoadingMeta): EtsAction<Promise<CarDriversData>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCarDriversData(driversData),
    meta,
  );

  return response;
};

export const actionGetCarDrivers = (car_id: Car['asuods_id'], meta: LoadingMeta): EtsAction<Promise<CarDriversData>> => async (dispatch) => {
  const carDriversData = await etsLoadingCounter(
    dispatch,
    promiseLoadCarDrivers(car_id),
    meta,
  );

  return carDriversData;
};

export const actionUpdateCarRegistration = (registrationData: CarRegistrationData, meta: LoadingMeta): EtsAction<Promise<CarRegistrationData>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCarRegistrationData(registrationData),
    meta,
  );

  return response;
};

export const actionLoadCarRegistration = (car_id: Car['asuods_id'], meta: LoadingMeta): EtsAction<Promise<CarRegistrationData>> => async (dispatch) => {
  const carDriversData = await etsLoadingCounter(
    dispatch,
    promiseLoadCarRegistration(car_id),
    meta,
  );

  return carDriversData;
};

export const actionUpdateCarPassport = (passportData: CarPassporntData, meta: LoadingMeta): EtsAction<Promise<CarPassporntData>> => async (dispatch) => {
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

export const actionLoadCarPassport = (car_id: Car['asuods_id'], meta: LoadingMeta): EtsAction<Promise<CarPassporntData>> => async (dispatch) => {
  const carDriversData = await etsLoadingCounter(
    dispatch,
    promiseLoadCarPassport(car_id),
    meta,
  );

  return carDriversData;
};

export const actionGetCarMissionsAndWaybillsByTimestamp = (payload: Parameters<typeof promiseGetCarMissionsAndWaybillsByTimestamp>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetCarMissionsAndWaybillsByTimestamp>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetCarMissionsAndWaybillsByTimestamp(payload),
    meta,
  );
};

export const actionPrintCarActualFile = (url: string, meta: LoadingMeta): EtsAction<Promise<{
  blob: Blob;
  fileName: string;
}>> => async (dispatch) => {
  const file = await etsLoadingCounter(
    dispatch,
    promisePrintCarActualFile(url),
    meta,
  );

  return file;
};
