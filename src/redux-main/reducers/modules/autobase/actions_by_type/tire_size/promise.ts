import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireSize } from 'redux-main/reducers/modules/autobase/constants';
import { TireSize } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getTireSize = autobaseLoadByType<TireSize>(tireSize);
