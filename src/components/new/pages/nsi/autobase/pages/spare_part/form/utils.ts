import { isObject, isNullOrUndefined } from 'util';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultSparePart: SparePart = {
  id: null,
  spare_part_group_id: null,
  name: null,
  number: null,
  measure_unit_id: null,
  quantity: null,
  supplied_at: null,
};

export const getDefaultSparePartElement = (element: Partial<SparePart>): SparePart => {
  const newElement = { ...defaultSparePart };
  if (isObject(element)) {
    Object.keys(defaultSparePart).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultSparePart[key];
    });
  }

  return newElement;
};
