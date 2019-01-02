import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireAvailableCar } from 'constants/autobase';

export const getTireAvailableCar = autobaseLoadByType(tireAvailableCar);
