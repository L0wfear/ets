import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { techMaintOrder } from 'redux-main/reducers/modules/autobase/constants';
import {
  clone,
  get,
} from 'lodash';
import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getTechMaintOrder = autobaseLoadByType<TechMaintOrder>(techMaintOrder);
export const createTechMaintOrder = autobaseCreateByType<TechMaintOrder>(techMaintOrder);
export const updateTechMaintOrder = autobaseUpdateByType<TechMaintOrder>(techMaintOrder);
export const removeTechMaintOrder = autobaseRemoveByType(techMaintOrder);

export const getSetTechMaintOrder = async (payload) => {
  const { data } = await getTechMaintOrder(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

const editTechMaintOrderBeforeSave = (rawTechMaintOrder: TechMaintOrder) => {
  const newObj = clone(rawTechMaintOrder);

  if (newObj.is_periodic) {
    delete newObj.sequence;
  }
  if (!newObj.interval_time_type) {
    delete newObj.interval_time_type;
  }

  return newObj;
};

export const createSetTechMaintOrder = (rawTechMaintOrder: TechMaintOrder) => {
  const payload = editTechMaintOrderBeforeSave(
    rawTechMaintOrder,
  );

  return createTechMaintOrder(
    payload,
  );
};
export const updateSetTechMaintOrder = (oldTechMaintOrder: TechMaintOrder) => {
  const payload = editTechMaintOrderBeforeSave(
    oldTechMaintOrder,
  );

  return updateTechMaintOrder(
    payload,
  );
};
export const autobaseDeleteTechMaintOrder = (id: number) => {
  return removeTechMaintOrder(
    id,
  );
};
