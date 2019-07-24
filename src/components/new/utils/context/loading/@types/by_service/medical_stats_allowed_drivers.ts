import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';

export type MedicalStatsAllowedDriver = {
  active: Employee['active'];
  birthday: Employee['birthday'];
  company_id: Employee['company_id'];
  company_structure_id: Employee['company_structure_id'];
  drivers_license: Employee['drivers_license'];
  first_name: Employee['first_name'];
  id: Employee['id'];
  last_name: Employee['last_name'];
  middle_name: Employee['middle_name'];
  personnel_number: Employee['personnel_number'];
  phone: Employee['phone'];
  position_id: Employee['position_id'];
  position_name: Employee['position_name'];
  prefer_car: Employee['prefer_car'];
  special_license: Employee['special_license'];
};
