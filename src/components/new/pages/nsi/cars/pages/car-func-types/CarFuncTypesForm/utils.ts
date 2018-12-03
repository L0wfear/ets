import { isObject, isNullOrUndefined } from 'util';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type GetDefaultCarFuncTypesElement = (carFuncTypes: CarFuncTypes | null) => CarFuncTypes;

export const defaultCarFuncTypes: CarFuncTypes = {
  asuods_id: null,
  avg_work_hours: null,
  short_name: null,
  full_name: null,
  group_id: null,
  group_name: null,
};

export const getDefaultCarFuncTypesElement: GetDefaultCarFuncTypesElement = (element) => {
  const newElement = { ...defaultCarFuncTypes };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = !isNullOrUndefined(value) ? value : defaultCarFuncTypes[key];
    });
  }

  return newElement;
};
