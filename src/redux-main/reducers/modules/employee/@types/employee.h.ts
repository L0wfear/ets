export type Employee = {
  active: boolean;
  additional_companies: {
    company_id: number | null;
    name: string | null;
    short_name: string | null;
  }[];
  birthday: string | null;
  can_duty_mission: boolean
  category_drivers_license: string[] | null;
  category_drivers_license_text: string | null;
  category_special_license: string[] | null;
  category_special_license_text: string | null;
  company_id: number | null;
  company_name: string | null;
  company_structure_id: null
  company_structure_name: string | null;
  drivers_license: string | null;
  drivers_license_date_end: string | null;
  first_name: string | null;
  full_name: string | null;
  files: any[];
  driver_license_files?: any[];
  medical_certificate_files?: any[];
  has_car: null
  id: number | null;
  is_brigade: boolean
  is_common: boolean
  is_driver?: boolean;
  last_name: string | null;
  medical_certificate: string | null;
  medical_certificate_date: string | null;
  middle_name: string | null;
  personnel_number: string | null;
  phone: string | null;
  position_id: number | null;
  position_name: string | null;
  prefer_car: string | null;
  prefer_car_text: string | null;
  secondary_car: string[]
  secondary_car_text: string | null;
  special_license: string | null;
  special_license_date_end: string | null;
  special_marks: string | null;
  assignment: string | null;
  assignment_date_start: string | null;
  assignment_date_end: string | null;
  assignment_files?: any[];
};
export type Driver = {
  active: boolean;
  birthday: string | null;
  company_id: number | null;
  company_structure_id: number | null;
  drivers_license: string | null;
  first_name: string | null;
  id: number | null;
  last_name: string | null;
  middle_name: string | null;
  personnel_number: string | null;
  phone: string | null;
  position_id: number | null;
  position_name: string | null;
  prefer_car: string | null;
  special_license: string | null;
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
