import { isObject, isNullOrUndefined } from 'util';
import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultTechMaintOrder: TechMaintOrder = {
  car_model_id: null,
  car_model_name: '',
  description: '',
  entity_name: '',
  id: null,
  interval_probeg: null,
  interval_time: null,
  interval_time_type: null,
  is_periodic: false,
  measure_unit_run_id: null,
  measure_unit_run_name: '',
  sequence: null,
  tech_maintenance_type_id: null,
  tech_maintenance_type_name: '',
  files: [],
};

export const getDefaultTechMaintOrderElement = (element: Partial<TechMaintOrder>): TechMaintOrder => {
  const newElement = { ...defaultTechMaintOrder };
  if (isObject(element)) {
    Object.keys(defaultTechMaintOrder).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultTechMaintOrder[key];
    });
  }

  return newElement;
};
