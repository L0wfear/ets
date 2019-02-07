import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { sparePartGroup } from 'redux-main/reducers/modules/autobase/constants';

export const getSparePartGroup = autobaseLoadByType(sparePartGroup);
