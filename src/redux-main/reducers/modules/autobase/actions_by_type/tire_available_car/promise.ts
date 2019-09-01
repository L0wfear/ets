import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireAvailableCar } from 'redux-main/reducers/modules/autobase/constants';
import { TireAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getTireAvailableCar = autobaseLoadByType<TireAvailableCar>(tireAvailableCar);
