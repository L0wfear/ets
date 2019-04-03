import { isObject, isNullOrUndefined } from 'util';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultTireModel: TireModel = {
  id: null,
  name: '',
  tire_manufacturer_id: null,
  tire_manufacturer_name: '',
};

export const getDefaultTireModelElement = (element: Partial<TireModel>): TireModel => {
  const newElement = { ...defaultTireModel };
  if (isObject(element)) {
    Object.keys(defaultTireModel).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultTireModel[key];
    });
  }

  return newElement;
};
