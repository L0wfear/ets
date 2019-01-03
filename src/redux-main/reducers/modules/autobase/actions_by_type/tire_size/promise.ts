import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tireSize } from 'redux-main/reducers/modules/autobase/constants';

export const getTireSize = autobaseLoadByType(tireSize);
