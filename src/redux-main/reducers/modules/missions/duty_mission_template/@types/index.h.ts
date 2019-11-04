export type DutyMissionTemplate = {
  brigade_employee_id_list: Array<{
    employee_fio: string;
    employee_id: number;
  }>;
  brigade_employee_id_list_id: Array<number>;
  brigade_employee_id_list_fio: Array<string>;
  brigade_id: number | null;
  comment: string;
  date_create: string | null;
  foreman_fio: string;
  foreman_full_fio: string;
  foreman_id: number | null;
  id: number | null;
  is_actual: boolean;
  kind_task_ids: Array<number>;
  municipal_facility_id: number | null;
  municipal_facility_name: string;
  norm_id: number | null;
  number: number | null;
  route_id: number | null;
  route_name: string;
  structure_id: number | null;
  structure_name: string;
  technical_operation_id: number | null;
  technical_operation_name: string;
  work_class_id: number | null;
};
