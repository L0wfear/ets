import {
  autobaseLoadCars,
} from 'redux-main/reducers/modules/autobase/promises';
import { Car } from '../@types/autobase.h';
import { get, cloneDeep } from 'lodash';
import {
  CarDrivers,
  CarRegistrationRegistryService,
  CarPassportRegistryService,
  CarActualService,
  CarPassportGibddRegistryService,
  CarPassportGtnRegistryService,
  CarService,
  CarInfoService,
} from 'api/Services';
import { CarDriversData, CarRegistrationData, CarPassporntData } from './@types';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const getCars = autobaseLoadCars;

export const getFrontCar = (carOwn, index: number) => {
  const car: Car = cloneDeep(carOwn);

  car.company_name_customer = car.company_name;
  car.company_name_contractor = car.company_name;

  return car;
};

export const getBackCar = (carOwn: Car) => {
  const car = cloneDeep(carOwn);

  delete car.company_name_customer;
  delete car.company_name_contractor;

  return car;
};

export const promiseLoadCarByAsuodsId = async (asuods_id: Car['asuods_id']) => {
  const response = await CarService.get({ asuods_id });

  const result: Car = get(response, 'result.rows.0');

  return result;
};

export const promiseUpdateCar = async (car: Car): Promise<Car> => {
  await CarActualService.put(
    {
      ...car,
      car_id: car.asuods_id,
    },
    false,
    'json',
  );

  return car;
};
export const promiseUpdateCarDriversData = async (driversData: CarDriversData): Promise<CarDriversData> => {
  await CarDrivers.path(driversData.car_id).put(
    { ...driversData },
    false,
    'json',
  );

  return driversData;
};
export const promiseUpdateCarRegistrationData = async (registrationData: CarRegistrationData): Promise<CarRegistrationData> => {
  if (registrationData.id) {
    await CarRegistrationRegistryService.path(registrationData.id).put(
      {
        ...registrationData,
        given_at: createValidDate(registrationData.given_at),
      },
      false,
      'json',
    );
  } else {
    await CarRegistrationRegistryService.post(
      {
        ...registrationData,
        given_at: createValidDate(registrationData.given_at),
      },
      false,
      'json',
    );
  }

  return Promise.resolve(registrationData);
};
export const promiseUpdateCarPassportData = async (passportData: CarPassporntData): Promise<CarPassporntData> => {
  let ServiceName = null;
  if (passportData.type === 'GIBDD') {
    ServiceName = CarPassportGibddRegistryService;
  }
  if (passportData.type === 'GTN') {
    ServiceName = CarPassportGtnRegistryService;
  }

  if (passportData.id) {
    await ServiceName.path(passportData.id).put(
      {
        ...passportData,
        given_at: createValidDate(passportData.given_at),
      },
      false,
      'json',
    );
  } else {
    await ServiceName.post(
      {
        ...passportData,
        given_at: createValidDate(passportData.given_at),
      },
      false,
      'json',
    );
  }

  return passportData;
};

export const promiseLoadCarDrivers = (car_id: Car['asuods_id']): Promise<CarDriversData> => {
  return CarDrivers.get<CarDriversData>({ car_id });
};

export const promiseLoadCarRegistration = async (car_id: Car['asuods_id']) => {
  const response = await CarRegistrationRegistryService.get({ car_id });

  const carRegistrationData: CarRegistrationData = get(response, 'result.rows.0', null);

  return carRegistrationData;
};

export const promiseLoadCarPassport = async (car_id: Car['asuods_id']) => {
  const response = await CarPassportRegistryService.get({ car_id });

  const carPassporntData: CarPassporntData = get(response, 'result.rows.0', null);

  return carPassporntData;
};

type Paylaod = (
  { car_id: Car['asuods_id'], point_timestamp: number }
  | { car_id: Car['asuods_id'], date_start: string; date_end: string }
);

export const promiseGetCarMissionsByTimestamp = async (payload: Paylaod) => {
  let response = null;

  try {
    response = await CarInfoService.get(payload);
  } catch (error) {
    // tslint:disable-next-line
    console.warn(error);  
  }

  const result: {
    missions: Array<any>;
    contractor_name: string;
    customer_name: string;
    owner_name: string;
  } = get(response, 'result');

  return result;
};
