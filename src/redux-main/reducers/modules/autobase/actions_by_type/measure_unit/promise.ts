import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { measureUnit } from 'redux-main/reducers/modules/autobase/constants';
import { MeasureUnit } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getMeasureUnit = autobaseLoadByType<MeasureUnit>(measureUnit);
