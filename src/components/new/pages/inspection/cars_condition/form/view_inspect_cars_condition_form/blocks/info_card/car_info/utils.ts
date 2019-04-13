import { isObject, isNullOrUndefined } from 'util';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export const defaultCarsConditionCar: CarsConditionCars = {
  fact_status: '',
  fact_status_text: '',
  gov_number: '',
  id: null,
  marka: '',
  model: '',
  type: '',
  was_resaved: false,
};

export const getDefaultCarsConditionCarElement = (element: Partial<CarsConditionCars>) => {
  const newElement = { ...defaultCarsConditionCar };
  if (isObject(element)) {
    Object.keys(defaultCarsConditionCar).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultCarsConditionCar[key];
    });
  }

  return newElement;
};
