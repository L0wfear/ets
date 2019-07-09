export type Employee = {
  active: boolean;
  additional_companies: {
    company_id: number;
    name: string;
    short_name: string;
  }[];
  birthday: string;
  can_duty_mission: boolean
  category_drivers_license: string[];
  category_drivers_license_text: string;
  category_special_license: string[];
  category_special_license_text: string;
  company_id: number;
  company_name: string;
  company_structure_id: null
  company_structure_name: string;
  drivers_license: string;
  drivers_license_date_end: string;
  first_name: string;
  full_name: string;
  files: any[];
  driver_license_files?: any[];
  medical_certificate_files?: any[];
  has_car: null
  id: number;
  is_brigade: boolean
  is_common: boolean
  is_driver?: boolean;
  last_name: string;
  medical_certificate: string;
  medical_certificate_date: string;
  middle_name: string;
  personnel_number: string;
  phone: string;
  position_id: number;
  position_name: string;
  prefer_car: string;
  prefer_car_text: string;
  secondary_car: string[]
  secondary_car_text: string;
  snils: string;
  special_license: string;
  special_license_date_end: string;
  special_marks: string;
  assignment: string;
  assignment_date_start: string;
  assignment_date_end: string;
  assignment_files?: any[];
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
  employeeList: Employee[];
  employeeIndex: Record<Employee['id'], Employee>;
  driverList: Driver[];
  driverIndex: Record<Driver['id'], Driver>;
  positionList: Position[];
  positionIndex: Record<Position['id'], Position>;
};
