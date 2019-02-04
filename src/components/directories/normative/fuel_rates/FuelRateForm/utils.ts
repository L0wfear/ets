import { isObject } from 'util';
import { ICreateFuel } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';

export type GetDefaultFuelRateElement = (ICreateFuel: ICreateFuel | null) => ICreateFuel;

export const defaultFuelRate: ICreateFuel = {
  id: null,
  car_model_id: null,
  car_special_model_id: null,
  company_structure_id: null,
  operation_id: null,
  order_date: new Date(),
  summer_rate: null,
  winter_rate: null,
  car_model_name: null,
  car_special_model_name: null,
};

export const getDefaultFuelRateElement: GetDefaultFuelRateElement = (element) => {
  const newElement = { ...defaultFuelRate };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
