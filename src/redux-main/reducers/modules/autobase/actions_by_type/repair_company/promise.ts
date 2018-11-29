import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { repairCompany } from 'constants/autobase';
import { get } from 'lodash';

export const getRepairCompany = autobaseLoadByType(repairCompany);
export const createRepairCompany = autobaseCreateByType(repairCompany);
export const updateRepairCompany = autobaseUpdateByType(repairCompany);
export const removeRepairCompany = autobaseRemoveByType(repairCompany);

export const getSetRepairCompany = async (payload) => {
  const { data } = await getRepairCompany(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

export const createSetRepairCompany = (rawRepairCompany) => {
  const payload = {
    ...rawRepairCompany,
  };

  return createRepairCompany(
    payload,
  );
};
export const updateSetRepairCompany = (oldRepairCompany) => {
  const payload = {
    ...oldRepairCompany,
  };

  return updateRepairCompany(
    payload,
  );
};
export const autobaseDeleteRepairCompany = (id) => {
  return removeRepairCompany(
    id,
  );
};
