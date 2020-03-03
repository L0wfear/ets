import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { repairType } from 'redux-main/reducers/modules/autobase/constants';
import { RepairType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getSetRepairType = autobaseLoadByType<RepairType>(repairType);
export const createSetRepairType = autobaseCreateByType<RepairType>(repairType);
export const updateSetRepairType = autobaseUpdateByType<RepairType>(repairType);
export const autobaseDeleteRepairType = autobaseRemoveByType(repairType);
