import { Route } from 'redux-main/reducers/modules/routes/@types';

export type MunicipalFacility = {
  car_func_types: {
    asuods_id: number;
    name: string;
    id: number;
  }[];
  car_func_types_text: string;
  kind_tasks: {
    kind_task_name: string;
    kind_task_id: number;
  }[];
  municipal_facility_code: string;
  municipal_facility_id: number;
  municipal_facility_name: string;
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

export type MunicipalFacilityMeasureUnit = {
  measure_unit_id: number;
  id: number;
  municipal_facility_id: number;
  measure_unit_name: number;
};
