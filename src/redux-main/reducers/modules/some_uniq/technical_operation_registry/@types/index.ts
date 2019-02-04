import { Route } from 'redux-main/reducers/modules/routes/@types';

export type TechnicalOperationRegistry = {
  asuods_id: number | null;
  car_func_types: {
    asuods_id: number;
    name: string;
    id: number;
  }[];
  car_func_types_text: string;
  id: number | null;
  is_new?: boolean;
  kind_task_ids: number[];
  name: string;
  norm_ids: number[];
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
