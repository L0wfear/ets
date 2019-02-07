import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { actualTiresOnCar } from 'redux-main/reducers/modules/autobase/constants';

export const getActualTiresOnCar = autobaseLoadByType(actualTiresOnCar);
