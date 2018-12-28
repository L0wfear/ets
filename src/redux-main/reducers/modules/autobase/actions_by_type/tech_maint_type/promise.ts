import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { techMaintType } from 'constants/autobase';

export const getTechMaintType = autobaseLoadByType(techMaintType);
