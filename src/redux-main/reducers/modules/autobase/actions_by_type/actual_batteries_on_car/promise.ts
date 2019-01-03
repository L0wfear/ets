import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { actualBatteriesOnCar } from 'redux-main/reducers/modules/autobase/constants';

export const getActualBatteriesOnCar = autobaseLoadByType(actualBatteriesOnCar);
