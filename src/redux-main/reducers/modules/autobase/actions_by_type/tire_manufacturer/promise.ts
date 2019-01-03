import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireManufacturer } from 'redux-main/reducers/modules/autobase/constants';

export const getTireManufacturer = autobaseLoadByType(tireManufacturer);
