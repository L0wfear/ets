import { isObject, isNullOrUndefined } from 'util';
import { Route } from 'redux-main/reducers/modules/routes/@types';

export const defaultRoute: Route = {
  name: '',
  draw_object_list: [],
  input_lines: [],
  object_list: [],
  comment: '',
  company_id: null,
  created_at: null,
  id: null,
  is_main: true,
  is_new: true,
  is_template: false,
  municipal_facility_id: null,
  municipal_facility_name: '',
  norm_id: null,
  seasons: [],
  structure_id: null,
  structure_name: null,
  technical_operation_id: null,
  technical_operation_name: '',
  type: null,
  work_types: [],
  work_type_code: null,
  work_type_name: '',
};

export const getDefaultRouteElement = (element?: Partial<Route> | null) => {
  const newElement = { ...defaultRoute };
  if (isObject(element)) {
    Object.keys(defaultRoute).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultRoute[key];
    });
  }

  return newElement;
};
