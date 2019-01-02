import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { actualTiresOnCar } from 'constants/autobase';

export const getActualTiresOnCar = autobaseLoadByType(actualTiresOnCar);
