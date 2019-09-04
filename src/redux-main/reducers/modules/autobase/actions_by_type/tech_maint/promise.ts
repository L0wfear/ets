import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { techMaint } from 'redux-main/reducers/modules/autobase/constants';
import {
  clone,
  get,
} from 'lodash';
import { TechMaintenance } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const getTechMaint = autobaseLoadByType<TechMaintenance>(techMaint);
export const createTechMaint = autobaseCreateByType<TechMaintenance>(techMaint);
export const updateTechMaint = autobaseUpdateByType<TechMaintenance>(techMaint);
export const removeTechMaint = autobaseRemoveByType(techMaint);

export const getSetTechMaint = async (payload) => {
  const { data, extraData } = await getTechMaint(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
    extraData,
  };
};

const editTechMaintBeforeSave = (rawTechMaint: TechMaintenance) => {
  const newObj = clone(rawTechMaint);
  newObj.plan_date_start = createValidDate(newObj.plan_date_start);
  newObj.plan_date_end = createValidDate(newObj.plan_date_end);
  newObj.fact_date_start = createValidDate(newObj.fact_date_start);
  newObj.fact_date_end = createValidDate(newObj.fact_date_end);

  return newObj;
};

export const createSetTechMaint = (rawTechMaint: TechMaintenance) => {
  const payload = editTechMaintBeforeSave(
    rawTechMaint,
  );

  return createTechMaint(
    payload,
  );
};
export const updateSetTechMaint = (oldTechMaint: TechMaintenance) => {
  const payload = editTechMaintBeforeSave(
    oldTechMaint,
  );

  return updateTechMaint(
    payload,
  );
};
export const autobaseDeleteTechMaint = (id: number) => {
  return removeTechMaint(
    id,
  );
};
