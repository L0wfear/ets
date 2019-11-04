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
  car_func_types: Array<NormRegistryCarFuncTypes>;
  car_func_types_ids: Array<number>;
  car_func_types_text: string;
  check_type_names: string;
  check_types: Array<string>;
  conditions: string;
  consumable_materials_names: Array<string>;
  elements: Array<NormRegistryElement>;
  elements_ids: Array<number>;
  elements_names: string;
  elements_text: string;
  id: number;
  is_cleaning_norm: boolean;
  kind_task_ids: Array<number>;
  kind_task_names: Array<string>;
  kind_task_names_text: string;
  max_speed: number;
  max_speed_text: string;
  name: string;
  norm: number;
  norm_registry_id: number;
  norm_id: number;
  norm_period: number;
  normatives: Array<any>;
  objects: Array<NormRegistryObject>;
  objects_ids: Array<number>;
  objects_names: Array<string>;
  objects_text_array: Array<string>;
  objects_text: string;
  period_interval_name: any;
  route_types: Array<string>;
  season_id: number;
  season_name: string;
  sensor_type_ids: Array<number>;
  sensor_types: Array<NormRegistrySensorTypes>;
  sensor_types_text: string;
  technical_operation_id: number;
  type_oper_id: number;
  use_in_report: boolean;
  work_class_id: number;
  work_type_id: number;
  work_type_name: string;
  type_oper_name: string;
};
