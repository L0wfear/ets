export type EmployeeOnCar = {
  asuods_id: number;
  binding_type: 'primary' | 'secondary';
  binding_type_text: 'Основное' | 'Вторичное' | string;
  driver_fio: string;
  employee_id: number;
  garage_number: string;
  gov_number: string;

  frontId?: number;
};
