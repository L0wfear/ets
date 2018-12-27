import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryAvailableCar } from 'constants/autobase';

export const getBatteryAvailableCar = autobaseLoadByType(batteryAvailableCar);
