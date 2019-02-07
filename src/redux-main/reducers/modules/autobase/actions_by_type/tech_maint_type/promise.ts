import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { techMaintType } from 'redux-main/reducers/modules/autobase/constants';

export const getTechMaintType = autobaseLoadByType(techMaintType);
