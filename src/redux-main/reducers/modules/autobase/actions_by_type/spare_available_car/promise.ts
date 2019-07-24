import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { spareAvailableCar } from 'redux-main/reducers/modules/autobase/constants';

export const getSpareAvailableCar = autobaseLoadByType(spareAvailableCar);
