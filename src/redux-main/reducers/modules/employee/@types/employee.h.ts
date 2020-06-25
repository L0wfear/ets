import { EmployeeBindedToCar } from 'components/new/utils/context/loading/@types/by_service/employee_binded_to_car';
import { WaybillDriver } from 'redux-main/reducers/modules/employee/driver/@types';

export type Employee = {
  active: boolean;
  additional_companies: Array<{
    company_id: number;
    name: string;
    short_name: string;
  }>;
  birthday: string;
  can_duty_mission: boolean;
  category_drivers_license: Array<string>;
  category_drivers_license_text: string;
  category_special_license: Array<string>;
  category_special_license_text: string;
  company_id: number;
  company_name: string;
  company_structure_id: null;
  company_structure_name: string;
  drivers_license: string;
  drivers_license_date_end: string;
  first_name: string;
  full_name: string;
  files: Array<any>;
  driver_license_files?: Array<any>;
  medical_certificate_files?: Array<any>;
  has_car: null;
  id: number;
  is_brigade: boolean;
  is_common: boolean;
  is_driver?: boolean;
  last_name: string;
  medical_certificate: string;
  middle_name: string;
  okrug_name: string;
  personnel_number: string;
  phone: string;
  position_id: number;
  position_name: string;
  prefer_car: number;
  prefer_car_text: string;
  secondary_car: Array<number>;
  secondary_car_text: string;
  snils: string;
  special_license: string;
  special_license_date_end: string;
  special_marks: string;
  assignment: string;
  assignment_date_start: string;
  assignment_date_end: string;
  assignment_files?: Array<any>;
};
export type Driver = {
  active: boolean;
  birthday: string;
  company_id: number;
  company_structure_id: number;
  drivers_license: string;
  first_name: string;
  id: number;
  last_name: string;
  middle_name: string;
  personnel_number: string;
  phone: string;
  position_id: number;
  position_name: string;
  prefer_car: string;
  special_license: string;
  fio_license: string;
};

export type Position = {
  id: number;
  is_driver: boolean;
  position: string;
  responsible: boolean;
};

export type IStateEmployee = {
  employeeList: Array<Employee>;
  employeeIndex: Record<Employee['id'], Employee>;
  driverList: Array<Driver>;
  driverIndex: Record<Driver['id'], Driver>;
  positionList: Array<Position>;
  positionIndex: Record<Position['id'], Position>;
  employeeBindedToCarList: Array<EmployeeBindedToCar>;
  uniqEmployeesBindedOnCarList: Array<EmployeeBindedToCar>;

  waybillDriverList: Array<WaybillDriver>;
};
