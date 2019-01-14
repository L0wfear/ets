import {
  autobaseLoadCars,
  autobaseUpdateCar,
} from 'redux-main/reducers/modules/autobase/promises';

export const getCars = autobaseLoadCars;
export const updateCar = autobaseUpdateCar;

export const updateSetCar = (oldCar) => {
  const payload = {
    ...oldCar,
  };

  return autobaseUpdateCar(
    payload,
  );
};
