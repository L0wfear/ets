import { Car } from "redux-main/reducers/modules/autobase/@types/autobase.h";
import { Employee } from "redux-main/reducers/modules/employee/@types/employee.h";

export type EmployeeBindedToCar = {
  asuods_id: Car['asuods_id'];
  binding_type: 'primary' | 'secondary';
  driver_fio: string;
  employee_id: Employee['id'];
  gov_number: Car['gov_number'];
};
