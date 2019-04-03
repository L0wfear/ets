import { isObject, isNullOrUndefined } from 'util';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultBatteryBrand: BatteryBrand = {
  id: null,
  name: null,
  manufacturer_id: null,
  manufacturer_name: null,
};

export const getDefaultBatteryBrandElement = (element: Partial<BatteryBrand>): BatteryBrand => {
  const newElement = { ...defaultBatteryBrand };
  if (isObject(element)) {
    Object.keys(defaultBatteryBrand).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultBatteryBrand[key];
    });
  }

  return newElement;
};
