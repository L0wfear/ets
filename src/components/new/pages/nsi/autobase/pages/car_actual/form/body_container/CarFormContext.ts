import * as React from 'react';
import { CarWrap } from '../@types/CarForm';

export type CarActualRegistryFormContextType = {
  currentSelectedCar: CarWrap | null;
};

export const CarActualRegistryFormContextDefaultVal: CarActualRegistryFormContextType = {
  currentSelectedCar: null,
};

export const CarActualRegistryFormContext = React.createContext(CarActualRegistryFormContextDefaultVal); // <<< !!! использовать только в карточке ТС
