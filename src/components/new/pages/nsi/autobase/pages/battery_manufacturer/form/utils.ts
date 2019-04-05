import { isObject } from 'util';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultBatteryManufacturer: BatteryManufacturer = {
  id: null,
  name: '',
};

export const getDefaultBatteryManufacturerElement = (element: Partial<BatteryManufacturer>): BatteryManufacturer => {
  const newElement = { ...defaultBatteryManufacturer };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
