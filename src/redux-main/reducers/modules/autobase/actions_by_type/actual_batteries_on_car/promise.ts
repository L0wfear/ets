import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { actualBatteriesOnCar } from 'constants/autobase';

export const getActualBatteriesOnCar = autobaseLoadByType(actualBatteriesOnCar);
