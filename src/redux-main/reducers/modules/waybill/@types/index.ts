import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type WaybillCarRefill = {
  fuel_card_id: number;
  type_id: number;
  value: number;
  number: string;
};

type TaxDataCar = {
  FACT_VALUE: number;
  FUEL_RATE: number;
  OPERATION: number;
  RESULT: number;
  comment: string;
  fuel_correction_rate: number;
  is_excluding_mileage: boolean;
  measure_unit_name: string;
  operation_name: string;
  iem_FACT_VALUE?: ValuesOf<Waybill['tax_data']>['FACT_VALUE'];  // нужно удалить
};

type WaybillEquipmentRefill = WaybillCarRefill;
type WaybillGasRefill = WaybillCarRefill;
type WaybillTaxDataGas = TaxDataCar;

export type waybillDiff = { // Поля, которые есть в ПЛ, но нет в строке реестра ПЛ, для увеличения производительности бека
  car_gps_code: string;
  trailer_type_id: number;
  trailer_gov_number: string;
  trailer_model_id: number;
  trailer_model_name: string;
  trailer_special_model_id: number;
  trailer_special_model_name: string;
  trailer_type_name: string;
  trailer_gps_code: string;
  hasEquipmentFuelRates: boolean | number;
  engine_kind_ids: Car['engine_kind_ids'];
};

export type WaybillRegistryRow = {
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
  car_refill: Array<WaybillCarRefill>;
  car_special_model_id: number;
  car_special_model_name: string;
  closed_by_employee_id: number;
  closed_by_employee_name: string;
  closed_editable: boolean;
  closing_date: string;
  comment: string;
  company_id: number;
  company_name: string;
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
  driver_personnel_number: string;
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
  files: Array<any>;
  fuel_card_ids: number;
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
  is_edited_odometr: boolean;
  is_edited_motohours: boolean;
  is_edited_motohours_equip: boolean;
  mission_id_list: Array<Mission['id']>;
  motohours_end: number;
  motohours_equip_end: number;
  motohours_equip_diff: number;
  motohours_equip_start: number;
  motohours_equip_reason_id: number;
  motohours_start: number;
  motohours_reason_id: number;
  number: number | string;
  okrug_id: string;
  okrug_name: string;
  odometr_end: number;
  odometr_start: number;
  odometr_reason_id: number;
  plan_arrival_date: string;
  plan_departure_date: string;
  sensor_consumption: number;
  sensor_refill: number;
  sensor_start_value: number;
  sensor_finish_value: number;
  status: 'draft' | any;
  status_text: string;
  structure_id: number;
  structure_name: string;
  tax_data: Array<TaxDataCar>;
  track_length: number;
  track_length_km: number;
  trailer_id: number;
  refill_type_ids: number;
  work_mode_id: number;
  work_mode_name: string;
  work_mode_text: string;
  season: 'winter' | 'summer';
  car_has_motohours: boolean;
  car_has_odometr: boolean;
};

export type WaybillGas = {
  gas_fuel_type: string;                      // + + + Тип топлива
  gas_fuel_start: number;                     // + + + Выезд, л
  gas_fuel_given: number;                     // + + + Выдано, л
  gas_fuel_end: number;                       // + + + Возврат по таксировке, л
  gas_fact_fuel_end: number;                  // + + + Возврат фактический, л
  gas_tax_data: Array<WaybillTaxDataGas>;     // + + + Расчет по норме
  gas_refill: Array<WaybillGasRefill>;        // + + + Заправки

  // Расчетные поля (только GET), не храним в бд
  gas_tax_consumption: number;                // + + + Расход по таксировке, л
  gas_fact_consumption: number;               // + + + Расход фактический, л
  gas_diff_consumption: number;               // + + + Расхождение в данных расхода, л
};

export type Waybill = (
  WaybillRegistryRow
  & waybillDiff
  & {
    equipment_tax_data_rows?: Array<any>; // для валидации
    tax_data_rows?: Array<any>; // для валидации
    gas_tax_data_rows?: Array<any>; // для валидации
    distance?: number; // для валидации
    hasEquipmentFuelRates?: boolean;

    odometr_diff?: number; // для жизни
    motohours_diff?: number; // для жизни
  }
  & WaybillGas
);

export type IStateWaybill = {
  waybillList: Array<Waybill>;
};
