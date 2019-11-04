import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';

export type Mission = {
  author: string;
  can_be_closed: boolean;
  can_be_closed_wb: boolean;
  can_edit_car_and_route: boolean;
  car_gov_number: string;
  car_gov_numbers: Array<string>;
  car_id: number | null;
  car_ids: Array<number>;
  car_model_name: string;
  car_model_names: Array<string>;
  car_special_model_name: string;
  car_special_model_names: Array<string>;
  car_type_id: number | null;
  car_type_ids: Array<number>;
  car_type_name: string;
  car_type_names: Array<string>;
  column_id: number | null;
  comment: string;
  current_percentage: null;
  date_end: string | null;
  date_start: string | null;
  description: string;
  id: number | null;
  is_archive: boolean;
  is_new: boolean;
  is_cleaning_norm?: boolean;
  is_valid_to_order_operation: boolean | null;
  for_column: boolean;
  mission_source_id: number | null;
  mission_source_name: string;
  mission_source_text: string;
  municipal_facility_id: number | null;
  municipal_facility_name: string;
  name: string;
  norm_id: number | null;
  norm_ids: Array<number>;
  norm_text: string;
  number: number | null;
  object_type_id: number | null;
  object_type_name: string;
  operation_num_execution: null;
  faxogramm_id?: number; // legacy
  order_id: number | null;
  order_number: string | null;
  order_operation_id: number | null;
  order_status: string;
  passes_count: number | null;
  reason_id: string;
  reason_name: string;
  request_id?: number;
  request_number?: string;
  route_id: number | null;
  route_type: 'mixed' | 'simple_dt' | 'points';
  route_name: string;
  status: string; // @todo
  status_name: string;
  structure_id: number | null;
  structure_name: string;
  technical_operation_id: number | null;
  technical_operation_name: string;
  type_id: number | null;
  type_name: string;
  waybill_id: number | null;
  waybill_number: number | null;

  is_mission_progress_countable: boolean | null;
  consumable_materials: Array<ConsumableMaterialCountMission>;
};

export type GetMissionPayload = {
  id?: number;
  status?: string; // @todo
  date_from?: string | null; // datetime
  date_to?: string | null; // datetime
  car_id?: number;
  technical_operation_id?: number;
  structure_id?: number;
  norm_id?: number;
  municipal_facility_id?: number;
  is_archive?: boolean;
  column_id?: number;

  limit?: number;
  offset?: number;
  sort_by?: string;
  filter?: string; // JSON.stringify(filterValues),
  request_id?: number; //
};

export type TypeMIssionData = {
  current_percentage: number;
  date_start: string | Date;
  date_end: string | Date;
  id: number;
  name: string;
  number: number;
  passes_count: number;
  sensor_percentage: void | number;
  sensor_traveled_idle: void | number;
  sensor_traveled_working: void | number;
  structure_id: void | number;
  traveled_percentage: number;
};

export type TypeCarData = {
  driver_fio: string;
  driver_phone: string;
  gov_number: string;
};

export type TypeRouteData = {
  id: number;
  check_unit: string;
  name: string;
  type: string;
  has_mkad: boolean;
};

export type TypeReportData = {
  entries: Array<any>;
  check_unit: string | void;
  check_value: number;
  estimated_finish_time: string | Date;
  estimated_time_left: string;
  left: number;
  left_percentage: number;
  status: string;
  time_high_speed: string;
  time_work_speed: string;
  traveled: number;
  traveled_high_speed: number;
  traveled_percentage: number;
  traveled_raw: number;
};
export type TypeTechnicalOperationData = {
  check_type: string;
  id: number;
  max_speed: number;
  name: string;
};
export type TypeWaybillData = {
  fact_arrival_date: string | Date;
  fact_departure_date: string | Date;
  number: number;
};
export type MissionDataType = {
  mission_data: TypeMIssionData;
  car_data: TypeCarData;
  route_data: TypeRouteData;
  report_data: TypeReportData;
  technical_operation_data: TypeTechnicalOperationData;
  waybill_data: TypeWaybillData;
};

export type MissionReassignationCreate = {
  mark: 'create';
};
export type MissionReassignationUpdate = {
  mark: 'update';
  missions: Array<
    Pick<
      Mission,
      'car_id'
      | 'comment'
      | 'column_id'
      | 'date_start'
      | 'date_end'
      | 'description'
      | 'faxogramm_id'
      | 'id'
      | 'mission_source_id'
      | 'name'
      | 'number'
      | 'passes_count'
      | 'route_id'
      | 'status'
      | 'structure_id'
      | 'technical_operation_id'
      | 'technical_operation_name'
      | 'waybill_id'
    > & {
    date_create: '2019-09-10T21:38:45';
    fail_reason: any;
  }>;
  waybill_id: number;
  waybill_number: number;
  waybill_plan_arrival_date: string;
  waybill_plan_departure_date: string;
};

export type MissionReassignation = (
  MissionReassignationCreate
  | MissionReassignationUpdate
);
