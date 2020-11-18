import { isObject, isNullOrUndefined } from 'util';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';

export type GetDefaultFuelingWaterElement = (FuelingWater: FuelingWater | null) => FuelingWater;

export const defaultFuelingWater: FuelingWater = {
  address: '',
  company_name: '',
  id: null,
  name: '',
  okrug_name: null,
  shape: {},
};

export const getDefaultFuelingWaterFormElement: GetDefaultFuelingWaterElement = (element) => {
  const newElement = { ...defaultFuelingWater };
  if (isObject(element)) {
    Object.keys(defaultFuelingWater).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultFuelingWater[key];
    });
  }

  return newElement;
};
