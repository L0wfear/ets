import { isObject, isNullOrUndefined } from 'util';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

export const defaultFuelOperations: FuelOperationActive = {
  equipment: false,
  id: null,
  is_excluding_mileage: false,
  measure_unit_id: null,
  measure_unit_name: '',
  name: '',
};

export const getDefaultFuelOperationElement = (element: Partial<FuelOperationActive>): FuelOperationActive => {
  const newElement = { ...defaultFuelOperations };
  if (isObject(element)) {
    Object.keys(defaultFuelOperations).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultFuelOperations[key];
    });
  }

  return newElement;
};
