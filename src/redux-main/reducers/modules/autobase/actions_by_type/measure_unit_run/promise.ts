import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { measureUnitRun } from 'constants/autobase';

export const getMeasureUnitRun = autobaseLoadByType(measureUnitRun);
