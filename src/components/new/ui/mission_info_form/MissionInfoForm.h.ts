import { IMissionInfoFormState } from 'components/new/ui/mission_info_form/MissionInfoForm.h';
import { HandleThunkActionCreator } from 'react-redux';
import routesActions from 'redux-main/reducers/modules/routes/actions';

export interface IMIssionData {
  column_id: number | void;
  current_percentage: number;
  date_start: string | Date;
  date_end: string | Date;
  id: number;
  name: string;
  number: number;
  passes_count: number;
  sensor_percentage: void | number;
  sensor_traveled_idle: void | number;
  sensor_traveled_working: number;
  structure_id: void | number;
  traveled_percentage: number;
}

export interface ICarData {
  driver_fio: string;
  driver_phone: string;
  gov_number: string;
  asuods_id: number;
  gps_code: string;
  car_func_type_id: number;
}

export interface IRouteData {
  id: number;
  check_unit: string;
  name: string;
  type: 'mixed' | 'simple_dt' | 'points';
  has_mkad: boolean;
  object_type_name: 'ОДХ' | 'ДТ' | 'ПН';
  has_object_list: boolean | null;
}

export interface IReportData {
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

export interface ITechnicalOperationData {
  check_type: string;
  id: number;
  max_speed: number;
  name: string;
}

export interface IWaybillData {
  fact_arrival_date: string | Date;
  fact_departure_date: string | Date;
}

export interface ISpeedLimits {
  speed_lim: number;
  mkad_speed_lim: number;
}

export interface IMissionInfoFormState {
  mission_data: IMIssionData;
  car_data: ICarData;
  route_data: IRouteData;
  report_data: IReportData;
  technical_operation_data: ITechnicalOperationData;
  waybill_data: IWaybillData;
  speed_limits: ISpeedLimits;
}

export type DispatchPropsMissionInfoForm = {
  loadGeozones: any;
  loadCarGpsCode: any;
  loadTrackCaching: any;
  actionLoadRouteById: HandleThunkActionCreator<
    typeof routesActions.actionLoadRouteById
  >;
};

export type PropsMissionInfoForm = DispatchPropsMissionInfoForm & {
  element: IMissionInfoFormState;
  onFormHide: any;
  company_id: number | null;
};

export type StateMissionInfoForm = {
  tooLongDates: boolean;
  polys: object;
  inputLines: any[];
  missionReport: any[];
  parkingCount: number | void;
  track: any[];
  front_parkings: any[];
  cars_sensors: object;
  gps_code: string | null;
};
