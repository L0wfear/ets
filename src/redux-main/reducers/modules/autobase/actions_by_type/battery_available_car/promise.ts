import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { batteryAvailableCar } from 'redux-main/reducers/modules/autobase/constants';
import { BatteryAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getBatteryAvailableCar = autobaseLoadByType<BatteryAvailableCar>(batteryAvailableCar);
