import { Route } from 'redux-main/reducers/modules/routes/@types';

export type MunicipalFacility = {
  car_func_types: Array<{
    asuods_id: number;
    name: string;
    id: number;
  }>;
  car_func_types_text: string;
  kind_tasks: Array<{
    kind_task_name: string;
    kind_task_id: number;
  }>;
  municipal_facility_code: string;
  municipal_facility_id: number;
  municipal_facility_name: string;
  normatives: Array<{
    id: number;
    oper_type_id: number;
    oper_type_name: string;
    tk_operation_id: number;
    tk_operation_name: string;
  }>;
  objects: Array<{
    asuods_id: number;
    name: string;
    id: number;
  }>;
  objects_text: string;
  route_types: Array<Route['type']>;
  seasons: Array<string>;
  work_type_codes: Array<number>;
  work_types: Array<{
    work_type_name: string;
    work_type_code: number;
  }>;
};

export type MunicipalFacilityMeasureUnit = {
  measure_unit_id: number;
  id: number;
  municipal_facility_id: number;
  measure_unit_name: string;
};
