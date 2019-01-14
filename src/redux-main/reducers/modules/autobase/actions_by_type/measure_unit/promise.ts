import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { measureUnit } from 'constants/autobase';

export const getMeasureUnit = autobaseLoadByType(measureUnit);
