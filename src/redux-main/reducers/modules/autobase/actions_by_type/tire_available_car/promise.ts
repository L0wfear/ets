import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireAvailableCar } from 'redux-main/reducers/modules/autobase/constants';

export const getTireAvailableCar = autobaseLoadByType(tireAvailableCar);
