import { isObject, isNullOrUndefined } from 'util';
import { FuelRate } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { getDateWithMoscowTz, createValidDateTime } from 'components/@next/@utils/dates/dates';

export const makeDefaultFuelRate = (): FuelRate => ({
  body_capacity: null,
  car_model_id: null,
  car_model_name: null,
  car_special_model_id: null,
  car_special_model_name: null,
  comment: null,
  company_id: null,
  company_name: null,
  company_structure_id: null,
  company_structure_name: null,
  full_model_name: null,
  gov_number: null,
  id: null,
  is_excluding_mileage: null,
  load_capacity: null,
  max_speed: null,
  measure_unit_id: null,
  measure_unit_name: null,
  model_name: null,
  operation_equipment: null,
  operation_id: null,
  operation_name: null,
  order_date: createValidDateTime(
    getDateWithMoscowTz(),
  ),
  order_number: null,
  summer_rate: null,
  winter_rate: null,
});

export const getDefaultFuelRateElement = (element?: Partial<FuelRate>) => {
  const newElement = makeDefaultFuelRate();
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
