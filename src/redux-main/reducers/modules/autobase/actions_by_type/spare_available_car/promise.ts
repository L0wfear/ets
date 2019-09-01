import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { spareAvailableCar } from 'redux-main/reducers/modules/autobase/constants';
import { SpareAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getSpareAvailableCar = autobaseLoadByType<SpareAvailableCar>(spareAvailableCar);
