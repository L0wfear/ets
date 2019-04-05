import {
  autobaseLoadCars,
  autobaseUpdateCar,
} from 'redux-main/reducers/modules/autobase/promises';
import { Car } from '../@types/autobase.h';
import { get, cloneDeep } from 'lodash';
import { CarDrivers, CarRegistrationRegistryService, CarPassportRegistryService } from 'api/Services';
import { CarDriversData, CarRegistrationData, CarPassporntData } from './@types';

export const getCars = autobaseLoadCars;
export const updateCar = autobaseUpdateCar;

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

// drivers_data отдельный запрос на обновление
// registration_data отдельный запрос на обновление
export const updateSetCar = (oldCar) => {
  const payload = {
    ...oldCar,
  };

  return autobaseUpdateCar(
    payload,
  );
};

export const promiseLoadCarDrivers = (car_id: Car['asuods_id']): Promise<CarDriversData> => {
  return CarDrivers.get({ car_id });
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
