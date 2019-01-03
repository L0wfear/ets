import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { measureUnit } from 'redux-main/reducers/modules/autobase/constants';

export const getMeasureUnit = autobaseLoadByType(measureUnit);
