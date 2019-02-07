import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryAvailableCar } from 'redux-main/reducers/modules/autobase/constants';

export const getBatteryAvailableCar = autobaseLoadByType(batteryAvailableCar);
