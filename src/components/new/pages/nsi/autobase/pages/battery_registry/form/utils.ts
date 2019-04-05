import { isObject, isNullOrUndefined } from 'util';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultBatteryRegistry: BatteryRegistry = {
  battery_to_car: [],
  battery_to_car_id: null,
  brand_id: null,
  brand_name: null,
  car_id: null,
  company_id: null,
  company_name: null,
  gov_number: null,
  id: null,
  installed_at: null,
  lifetime_months: null,
  manufacturer_id: null,
  manufacturer_name: null,
  odometr_start: null,
  released_at: null,
  serial_number: null,
  uninstalled_at: null,
  worked_months: null,
};

export const getDefaultBatteryRegistryElement = (element: Partial<BatteryRegistry>): BatteryRegistry => {
  const newElement = { ...defaultBatteryRegistry };
  if (isObject(element)) {
    Object.keys(defaultBatteryRegistry).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultBatteryRegistry[key];
    });
  }

  return newElement;
};
