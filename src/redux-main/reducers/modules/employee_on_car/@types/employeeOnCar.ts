export type EmployeeOnCar = {
  asuods_id: number;
  binding_type: 'primary' | 'secondary';
  binding_type_text: 'Основное' | 'Вторичное' | string;
  driver_fio: string;
  employee_id: number;
  garage_number: string;
  gov_number: string;
  special_model_name: string;
  type_name: string;
  condition_text: string;
  comment: string;
  operating_mode: string;
  driver_phone: string;
  full_model_name: string;
  assigned_car_count: number;
  frontId?: number;
};
