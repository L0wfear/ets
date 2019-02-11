export type CleaningOneNorm = {
  asuods_id: number;
  car_func_types: {
    short_name: string;
    id: number;
    asuods_id: number;
  }[];
  car_func_types_text: string;
  check_type_names: string;
  check_types: string[];
  conditions: string;
  elements: {
    id: number;
    check_type: any;
    name: string;
    max_speed: any;
  };
  elements_names: string[];
  elements_text: string;
  id: number;
  is_cleaning_norm: boolean;
  kind_task_ids: number[];
  kind_task_names: string[];
  kind_task_names_text: string;
  max_speed: null;
  max_speed_text: string;
  name: string;
  norm: number;
  norm_id: number;
  norm_period: number;
  normatives: any[];
  objects: {
    id: number;
    name: string;
    asuods_id: number;
  }[];
  objects_names: string[];
  objects_text: string;
  period_interval_name: null;
  route_types: string[];
  season_id: number;
  season_name: string;
  sensor_type_ids: number[];
  sensor_types: any[];
  technical_operation_id: number;
  type_oper_id: number;
  use_in_report: boolean;
  work_class_id: number;
  work_type_id: number;
  work_type_name: string;
};

export type GetCompanyStructureLinear = () => Promise<any>;
