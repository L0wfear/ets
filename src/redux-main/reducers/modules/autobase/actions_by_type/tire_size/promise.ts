import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireSize } from 'constants/autobase';

export const getTireSize = autobaseLoadByType(tireSize);
