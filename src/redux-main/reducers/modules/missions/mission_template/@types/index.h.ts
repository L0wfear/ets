export type MissionTemplate = {
  car_gov_numbers: Array<string>;
  car_gov_numbers_text: string;
  car_ids: Array<number>;
  car_type_ids: Array<number>;
  car_type_names: Array<string>;
  car_type_names_text: Array<string>;
  car_type_name_text: string;
  car_model_names: Array<string>;
  car_special_model_names: Array<string>;
  comment: string;
  company_id: number;
  date_create: string;
  description: string;
  for_column: boolean;
  id: number | null;
  is_actual: boolean;
  is_cleaning_norm: Array<boolean>;
  kind_task_ids: Array<number>;
  municipal_facility_id: number;
  municipal_facility_name: string;
  name: string;
  number: number;
  passes_count: number;
  route_id: number;
  route_name: string;
  route_type: string;
  structure_id: number;
  structure_name: string;
  technical_operation_id: number;
  technical_operation_name: string;
  type_oper_id: number;
  work_class_id: number;
  car_garage_numbers_text: string;
  car_garage_numbers: Array<string>;
};
