import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { sparePartGroup } from 'redux-main/reducers/modules/autobase/constants';
import { SparePartGroup } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getSparePartGroup = autobaseLoadByType<SparePartGroup>(sparePartGroup);
