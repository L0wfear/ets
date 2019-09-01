import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { measureUnitRun } from 'redux-main/reducers/modules/autobase/constants';
import { MeasureUnitRun } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getMeasureUnitRun = autobaseLoadByType<MeasureUnitRun>(measureUnitRun);
