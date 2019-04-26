import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type WaybillCarRefill = {
  fuel_card_id: number;
  type_id: number;
  value: number;
};

type WaybillEquipmentRefill = WaybillCarRefill;

export type Waybill = {
  accompanying_person_id: number;
  accompanying_person_name: string;
  activated_by_employee_id: number;
  activated_by_employee_name: string;
  all_missions_completed_or_failed: boolean | null;
  all_missions_status: 'not_all_completed' | any;
  can_delete_missions: boolean;
  car_id: number;
  car_model_id: number;
  car_model_name: string;
  car_refill: WaybillCarRefill[]
  car_special_model_id: number;
  car_special_model_name: string;
  closed_by_employee_id: number;
  closed_by_employee_name: string;
  closed_editable: boolean | false
  closing_date: string;
  comment: string;
  company_id: number;
  created_by_employee_id: number;
  created_by_employee_name: string;
  date_create: string;
  downtime_hours_dinner: number;
  downtime_hours_duty: number;
  downtime_hours_repair: number;
  downtime_hours_work: number;
  driver_id: number;
  equipment_fact_fuel_end: number;
  equipment_fuel: true
  equipment_fuel_end: number;
  equipment_fuel_given: number;
  equipment_fuel_start: number;
  equipment_fuel_to_give: number;
  equipment_fuel_type: string;
  equipment_refill: WaybillEquipmentRefill[];
  equipment_tax_data: any[];
  fact_arrival_date: string;
  fact_departure_date: string;
  fact_fuel_end: number;
  failed_medical_stat_types: boolean | null;
  fuel_end: number;
  fuel_given: number;
  fuel_start: number;
  fuel_to_give: number;
  fuel_type: 'DT' | any;
  garage_number: string;
  gov_number: string;
  id: number;
  is_bnso_broken: boolean | null;
  mission_id_list: Mission['id'][];
  motohours_end: number;
  motohours_equip_end: number;
  motohours_equip_start: number;
  motohours_start: number;
  number: number | string;
  odometr_end: number;
  odometr_start: number;
  plan_arrival_date: string;
  plan_departure_date: string;
  sensor_consumption: number;
  status: 'draft' | any;
  structure_id: number;
  structure_name: string;
  tax_data: any[];
  track_length: number;
  trailer_id: number;
  work_mode_id: number;
  work_mode_name: string;
  work_mode_text: string;
};

export type IStateWaybill = {
  waybillList: Waybill[];
};
