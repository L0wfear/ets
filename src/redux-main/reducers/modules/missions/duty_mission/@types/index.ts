import { DUTY_MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';

export type DutyMission = {
  author: string;
  brigade_employee_id_list: {
    employee_fio: string;
    employee_id: number;
  }[];
  brigade_employee_id_list_id: number[];
  brigade_employee_id_list_fio: string[];
  brigade_id: number | null;
  car_mission_id: null | number;
  car_mission_name: null | string;
  comment: string;
  fact_date_end: string | null;
  fact_date_start: string | null;
  faxogramm_id: null | number;
  foreman_fio: string;
  foreman_full_fio: string;
  foreman_id: number | null;
  id: number | null;
  is_archive: boolean;
  is_cleaning_norm: boolean;
  is_new?: boolean;
  is_valid_to_order_operation: null | boolean;
  mission_source_id: number | null;
  mission_source_name: string;
  mission_source_text: string;
  municipal_facility_id: number | null;
  municipal_facility_name: string;
  norm_id: number | null;
  norm_text: string | null;
  number: number | null;
  object_type_id: number | null;
  object_type_name: string | null;
  operation_num_execution: null
  order_number: string | null;
  order_operation_id: number | null;
  order_status: string | null;
  plan_date_end: string | null;
  plan_date_start: string | null;
  request_id?: number;
  request_number?: string;
  route_id: number | null;
  route_type: string;
  route_name: string;
  status: keyof typeof DUTY_MISSION_STATUS_LABELS;
  status_name: string;
  structure_id: number | null;
  structure_name: string;
  technical_operation_id: number | null;
  technical_operation_name: string;
  work_class_id: number | null;

  is_mission_progress_countable: boolean | null;
  consumable_materials: Array<ConsumableMaterialCountMission>;
};
