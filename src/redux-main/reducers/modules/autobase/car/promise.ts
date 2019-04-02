import {
  autobaseLoadCars,
  autobaseUpdateCar,
} from 'redux-main/reducers/modules/autobase/promises';
import { Car } from '../@types/autobase.h';
import { cloneDeep } from 'lodash';

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

export const updateSetCar = (oldCar) => {
  const payload = {
    ...oldCar,
  };

  return autobaseUpdateCar(
    payload,
  );
};
