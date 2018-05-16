export interface IComponentWillUnmountProps {
  tooLongDates: boolean;
  flux: any;
}

export type IComponentWillUnmount = (props: IComponentWillUnmountProps) => void;

export interface IComponentWillReceivePropsProps {
  track: any;
  parkingCount: number;
  setParkingCount: (parkingCount: number) => void;
}

export type IComponentWillReceiveProps = (props: IComponentWillReceivePropsProps) => void;

export interface IMIssionData {
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
export interface ICarData {
  driver_fio: string;
  driver_phone: string;
  gov_number: string;
}
export interface IRouteData{
  id: number;
  check_unit: string;
  name: string;
  type: string;
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
export interface IMissionInfoFormState {
  mission_data: IMIssionData;
  car_data: ICarData;
  route_data: IRouteData;
  report_data: IReportData;
  technical_operation_data: ITechnicalOperationData;
  waybill_data: IWaybillData;
}
export interface IComponentDidMountProps {
  formState: IMissionInfoFormState;
  flux: any;
  tooLongDates: boolean;
  multyChange: any;
}

export type IComponentDidMount = (props: IComponentDidMountProps) => void;