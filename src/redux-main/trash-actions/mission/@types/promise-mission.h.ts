export interface TypeMIssionData {
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
}

export interface TypeCarData {
  driver_fio: string;
  driver_phone: string;
  gov_number: string;
}

export interface TypeRouteData {
  id: number;
  check_unit: string;
  name: string;
  type: string;
  has_mkad: boolean;
}

export interface TypeReportData {
  entries: any[];
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
}
export interface TypeTechnicalOperationData {
  check_type: string;
  id: number;
  max_speed: number;
  name: string;
}
export interface TypeWaybillData {
  fact_arrival_date: string | Date;
  fact_departure_date: string | Date;
}
export interface MissionDataType {
  mission_data: TypeMIssionData;
  car_data: TypeCarData;
  route_data: TypeRouteData;
  report_data: TypeReportData;
  technical_operation_data: TypeTechnicalOperationData;
  waybill_data: TypeWaybillData;
}

export type MissionType = any;
export type DutyMissionType = any;
