import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { measureUnitRun } from 'redux-main/reducers/modules/autobase/constants';

export const getMeasureUnitRun = autobaseLoadByType(measureUnitRun);
