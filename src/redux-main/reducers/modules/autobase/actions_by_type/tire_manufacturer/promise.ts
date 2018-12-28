import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireManufacturer } from 'constants/autobase';

export const getTireManufacturer = autobaseLoadByType(tireManufacturer);
