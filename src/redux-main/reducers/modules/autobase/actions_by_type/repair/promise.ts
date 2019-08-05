import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { repair } from 'redux-main/reducers/modules/autobase/constants';
import { get } from 'lodash';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { createValidDate } from 'components/@next/@utils/dates/dates';
import { AUTOBASE_REPAIR_STATUS } from './status';

export const getRepair = autobaseLoadByType(repair);
export const createRepair = autobaseCreateByType(repair);
export const updateRepair = autobaseUpdateByType(repair);
export const removeRepair = autobaseRemoveByType(repair);

export const getSetRepair = async (payload) => {
  const { data } = await getRepair(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

export const createSetRepair = (rawRepair: Repair) => {
  const payload = {
    ...rawRepair,
    fact_date_start: createValidDate(rawRepair.fact_date_start),
    fact_date_end: createValidDate(rawRepair.fact_date_end),
    plan_date_start: createValidDate(rawRepair.plan_date_start),
    plan_date_end: createValidDate(rawRepair.plan_date_end),
  };

  if (!AUTOBASE_REPAIR_STATUS.passed.has.reduce((bool, key) => bool && !!payload[key], true)) {
    if (AUTOBASE_REPAIR_STATUS.in_progress.has.reduce((bool, key) => bool && payload[key], true)) {
      payload.status = 'in_progress';
    } else if (AUTOBASE_REPAIR_STATUS.planned.has.reduce((bool, key) => bool && payload[key], true)) {
      payload.status = 'planned';
    } else {
      delete payload.status;
    }
  }

  return createRepair(
    payload,
  );
};
export const updateSetRepair = (oldRepair: Repair) => {
  const payload = {
    ...oldRepair,
    fact_date_start: createValidDate(oldRepair.fact_date_start),
    fact_date_end: createValidDate(oldRepair.fact_date_end),
    plan_date_start: createValidDate(oldRepair.plan_date_start),
    plan_date_end: createValidDate(oldRepair.plan_date_end),
  };

  if (!AUTOBASE_REPAIR_STATUS.passed.has.reduce((bool, key) => bool && !!payload[key], true)) {
    if (AUTOBASE_REPAIR_STATUS.in_progress.has.reduce((bool, key) => bool && payload[key], true)) {
      payload.status = 'in_progress';
    } else if (AUTOBASE_REPAIR_STATUS.planned.has.reduce((bool, key) => bool && payload[key], true)) {
      payload.status = 'planned';
    } else {
      delete payload.status;
    }
  }

  return updateRepair(
    payload,
  );
};
export const autobaseDeleteRepair = (id) => {
  return removeRepair(
    id,
  );
};
