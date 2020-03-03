import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { repairCompany } from 'redux-main/reducers/modules/autobase/constants';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getSetRepairCompany = autobaseLoadByType<RepairCompany>(repairCompany);
export const createSetRepairCompany = autobaseCreateByType<RepairCompany>(repairCompany);
export const updateSetRepairCompany = autobaseUpdateByType<RepairCompany>(repairCompany);
export const autobaseDeleteRepairCompany = autobaseRemoveByType(repairCompany);
