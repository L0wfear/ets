import { isObject } from 'util';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type GetDefaultBatteryManufacturerElement = (batteryManufacturer: BatteryManufacturer | null) => BatteryManufacturer;

const defaultBatteryManufacturer: BatteryManufacturer = {
  id: null,
  name: null,
};

export const getDefaultBatteryManufacturerElement: GetDefaultBatteryManufacturerElement = (element) => {
  const newElement = { ...defaultBatteryManufacturer };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
