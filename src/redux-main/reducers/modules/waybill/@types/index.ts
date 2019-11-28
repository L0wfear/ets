import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type WaybillCarRefill = {
  fuel_card_id: number;
  type_id: number;
  value: number;
  number: string;
};

type WaybillEquipmentRefill = WaybillCarRefill;

export type Waybill = {
  accompanying_person_id: number;
  accompanying_person_name: string;
  activated_by_employee_id: number;
  activated_by_employee_name: string;
  all_missions_completed_or_failed: boolean;
  all_missions_status: 'not_all_completed' | any;
  can_delete_missions: boolean;
  car_id: number;
  car_model_id: number;
  car_model_name: string;
  car_type_id: number;
  car_type_name: string;
  car_gps_code: string;
  car_refill: Array<WaybillCarRefill>;
  car_special_model_id: number;
  car_special_model_name: string;
  closed_by_employee_id: number;
  closed_by_employee_name: string;
  closed_editable: boolean;
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
  driver_fio: string;
  driver_name: string;
  delete: boolean;
  equipment_fact_fuel_end: number;
  equipment_fuel: boolean;
  equipment_fuel_end: number;
  equipment_fuel_given: number;
  equipment_fuel_start: number;
  equipment_fuel_to_give: number;
  equipment_fuel_type: string;
  equipment_refill: Array<WaybillEquipmentRefill>;
  equipment_tax_data: Array<any>;
  fact_arrival_date: string;
  fact_departure_date: string;
  fact_fuel_end: number;
  failed_medical_stat_types: boolean;
  fuel_end: number;
  fuel_given: number;
  fuel_start: number;
  fuel_to_give: number;
  fuel_type: 'DT' | any;
  garage_number: string;
  gov_number: string;
  id: number;
  is_bnso_broken: boolean;
  is_one_fuel_tank: boolean;
  mission_id_list: Array<Mission['id']>;
  motohours_end: string;
  motohours_equip_end: string;
  motohours_equip_start: string; // num
  motohours_start: string; // num
  number: number | string;
  odometr_end: string; // num
  odometr_start: string; // num
  plan_arrival_date: string;
  plan_departure_date: string;
  sensor_consumption: number;
  status: 'draft' | any;
  status_text: string;
  structure_id: number;
  structure_name: string;
  tax_data: Array<{
    FACT_VALUE: number;
    FUEL_RATE: number;
    OPERATION: number;
    RESULT: string;       // number.toFixed(3)
    comment: string;
    fuel_correction_rate: number;
    is_excluding_mileage: boolean;
    measure_unit_name: string;
    operation_name: string;
    iem_FACT_VALUE?: ValuesOf<Waybill['tax_data']>['FACT_VALUE'];  // нужно удалить
  }>;
  track_length: number;
  trailer_id: number;
  trailer_type_id: number;
  trailer_type_name: string;
  trailer_gps_code: string;
  trailer_gov_number: string;
  trailer_model_id: number;
  trailer_model_name: string;
  trailer_special_model_id: number;
  trailer_special_model_name: string;
  work_mode_id: number;
  work_mode_name: string;
  work_mode_text: string;
  season: 'winter' | 'summer';
};

export type IStateWaybill = {
  waybillList: Array<Waybill>;
};
