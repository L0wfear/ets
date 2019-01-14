import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { sparePartGroup } from 'constants/autobase';

export const getSparePartGroup = autobaseLoadByType(sparePartGroup);
