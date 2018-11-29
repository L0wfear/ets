import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { repairType } from 'constants/autobase';
import { get } from 'lodash';

export const getRepairType = autobaseLoadByType(repairType);
export const createRepairType = autobaseCreateByType(repairType);
export const updateRepairType = autobaseUpdateByType(repairType);
export const removeRepairType = autobaseRemoveByType(repairType);

export const getSetRepairType = async (payload) => {
  const { data } = await getRepairType(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

export const createSetRepairType = (rawRepairType) => {
  const payload = {
    ...rawRepairType,
  };

  return createRepairType(
    payload,
  );
};
export const updateSetRepairType = (oldRepairType) => {
  const payload = {
    ...oldRepairType,
  };

  return updateRepairType(
    payload,
  );
};
export const autobaseDeleteRepairType = (id) => {
  return removeRepairType(
    id,
  );
};
