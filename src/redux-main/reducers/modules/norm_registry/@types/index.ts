export type NormRegistryCarFuncTypes = {
  id: number;
  asuods_id: number;
  name?: string;
  short_name?: string;
};

export type NormRegistryElement = {
  max_speed: number;
  id: number;
  name: string;
  check_type: string;
};

export type NormRegistryObject = {
  id: number;
  name: string;
  asuods_id: number;
};
export type NormRegistrySensorTypes = {
  sensor_type_id: number;
  sensor_type_name: string;
  technical_operation_id: number;
  technical_operation_name: string;
};

export type Norm = {
  asuods_id: number;
  car_func_types: NormRegistryCarFuncTypes[];
  car_func_types_ids: number[]
  car_func_types_text: string;
  check_type_names: string
  check_types: string[];
  conditions: string;
  elements: NormRegistryElement[];
  elements_ids: number[];
  elements_names: string;
  elements_text: string;
  id: number;
  is_cleaning_norm: boolean;
  kind_task_ids: number[];
  kind_task_names: string[];
  kind_task_names_text: string;
  max_speed: number;
  max_speed_text: string;
  name: string;
  norm: number;
  norm_registry_id: number;
  norm_id: number;
  norm_period: number;
  normatives: any[];
  objects: NormRegistryObject[];
  objects_ids: number[];
  objects_names: string[];
  objects_text_array: string[];
  objects_text: string;
  period_interval_name: any;
  route_types: string[];
  season_id: number;
  season_name: string;
  sensor_type_ids: number[];
  sensor_types: NormRegistrySensorTypes[];
  sensor_types_text: string;
  technical_operation_id: number;
  type_oper_id: number;
  use_in_report: boolean;
  work_class_id: number;
  work_type_id: number;
  work_type_name: string;
  type_oper_name: string;
};
