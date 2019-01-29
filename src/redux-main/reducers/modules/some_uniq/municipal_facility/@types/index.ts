import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';

export type MunicipalFacility = {
  car_func_types: {
    asuods_id: number;
    name: string;
    id: number;
  }[];
  car_func_types_text: string;
  kind_tasks: {
    kind_task_name: 'Централизованно';
    kind_task_id: 1;
  }[];
  municipal_facility_code: '1';
  municipal_facility_id: 1;
  municipal_facility_name: 'Проезжая часть';
  normatives: {
    id: number;
    oper_type_id: number;
    oper_type_name: string;
    tk_operation_id: number;
    tk_operation_name: string;
  }[];
  objects: {
    asuods_id: number;
    name: string;
    id: number;
  }[];
  objects_text: string;
  route_types: Route['type'][];
  seasons: string[];
  work_type_codes: number[];
};
