import { isObject, isNullOrUndefined } from 'util';
import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';

export const defaultEmployee: Norm = {
  asuods_id: null,
  car_func_types: [],
  car_func_types_ids: [],
  car_func_types_text: '',
  check_type_names: '',
  check_types: [],
  conditions: '',
  elements: [],
  elements_ids: [],
  elements_names: '',
  elements_text: '',
  id: null,
  is_cleaning_norm: false,
  kind_task_ids: [],
  kind_task_names: [],
  kind_task_names_text: '',
  max_speed: null,
  max_speed_text: '',
  name: '',
  norm: null,
  norm_registry_id: null,
  norm_id: null,
  norm_period: null,
  normatives: [],
  objects: [],
  objects_ids: [],
  objects_names: [],
  objects_text_array: [],
  objects_text: '',
  period_interval_name: null,
  route_types: '',
  season_id: null,
  season_name: '',
  sensor_type_ids: null,
  sensor_types: [],
  sensor_types_text: '',
  technical_operation_id: null,
  type_oper_id: null,
  use_in_report: false,
  work_class_id: null,
  work_type_id: null,
  work_type_name: '',
};

export const getDefaultNormElement = (element: Partial<Norm>): Norm => {
  const newElement = { ...defaultEmployee };
  if (isObject(element)) {
    Object.keys(defaultEmployee).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultEmployee[key];
    });
  }

  return newElement;
};
