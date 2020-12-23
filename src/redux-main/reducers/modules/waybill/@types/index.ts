import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OneRefillFuelCompanyData } from 'redux-main/reducers/modules/some_uniq/refill_fuel_company/@types';
import {
  MOTOHOURS_MILEAGE_TYPE_ID,
  ODOMETR_MILEAGE_TYPE_ID,
} from 'constants/dictionary';

type WaybillCarRefill = {
  fuel_card_id: number;
  type_id: number;
  value: number;
  number: string;
  date: string;
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
type WaybillelectricalRefill = WaybillCarRefill;
type WaybillTaxDataGas = TaxDataCar;
type WaybillTaxDataelectrical = TaxDataCar;

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
  failed_medical_stat_types: boolean;
  files: Array<any>;
  fuel_card_ids: number;
  fuel_to_give: number;
  garage_number: string;
  gov_number: string;
  id: number;
  is_bnso_broken: boolean;
  is_one_fuel_tank: boolean;
  is_edited_motohours_equip: boolean;
  is_edited_start: boolean;
  mileage_type_id: typeof MOTOHOURS_MILEAGE_TYPE_ID | typeof ODOMETR_MILEAGE_TYPE_ID;
  mission_id_list: Array<Mission['id']>;
  motohours_equip_end: number;
  motohours_equip_diff: number;
  motohours_equip_start: number;
  motohours_equip_reason_id: number;
  number: number | string;
  okrug_id: string;
  okrug_name: string;
  plan_arrival_date: string;
  plan_departure_date: string;
  sensor_consumption: number;
  sensor_leak: number;
  sensor_refill: number;
  sensor_start_value: number;
  sensor_finish_value: number;
  status: 'draft' | any;
  status_text: string;
  structure_id: number;
  structure_name: string;
  track_length: number;
  track_length_km: number;
  trailer_id: number;
  refill_type_ids: number;
  work_mode_id: number;
  work_mode_name: string;
  work_mode_text: string;
  season: 'winter' | 'summer';
} & WaybillFuel & WaybillOdometr & WaybillMotoHours;

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

export type WaybillElectrical = {
  electrical_fuel_type: string;                      // + + + Тип топлива
  electrical_fuel_start: number;                     // + + + Выезд, л
  electrical_fuel_given: number;                     // + + + Выдано, л
  electrical_fuel_end: number;                       // + + + Возврат по таксировке, л
  electrical_fact_fuel_end: number;                  // + + + Возврат фактический, л
  electrical_tax_data: Array<WaybillTaxDataelectrical>;     // + + + Расчет по норме
  electrical_refill: Array<WaybillelectricalRefill>;        // + + + Заправки

  electrical_tax_consumption: number;                // + + + Расход по таксировке, л
  electrical_fact_consumption: number;               // + + + Расход фактический, л
  electrical_diff_consumption: number;               // + + + Расхождение в данных расхода, л
};

export type WaybillFuel = {
  fuel_type: string;                      // + + + Тип топлива
  fuel_start: number;                     // + + + Выезд, л
  fuel_given: number;                     // + + + Выдано, л
  fuel_end: number;                       // + + + Возврат по таксировке, л
  fact_fuel_end: number;                  // + + + Возврат фактический, л
  tax_data: Array<TaxDataCar>;            // + + + Расчет по норме
  car_refill: Array<WaybillCarRefill>;    // + + + Заправки

  tax_consumption: number;                // + + + Расход по таксировке, л
  fact_consumption: number;               // + + + Расход фактический, л
  diff_consumption: number;               // + + + Расхождение в данных расхода, л
};

export type WaybillRefill = {
  is_no_fuel_refill: boolean;
  is_no_gas_refill: boolean;
  is_no_electrical_refill: boolean;
  is_no_equipment_refill: boolean;
};

export type WaybillOdometr = {
  is_edited_odometr: boolean;
  odometr_end: number;
  odometr_start: number;
  odometr_reason_id: number;
  car_has_odometr: boolean;
  odometr_diff?: number; // для жизни
};

export type WaybillMotoHours = {
  is_edited_motohours: boolean;
  motohours_end: number;
  motohours_start: number;
  motohours_reason_id: number;
  car_has_motohours: boolean;
  motohours_diff?: number; // для жизни
};

export type Waybill = (
  WaybillRegistryRow
  & waybillDiff
  & {
    equipment_tax_data_rows?: Array<any>; // для валидации
    tax_data_rows?: Array<any>; // для валидации
    gas_tax_data_rows?: Array<any>; // для валидации
    electrical_tax_data_rows?: Array<any>; // для валидации
    distance?: number; // для валидации
    hasEquipmentFuelRates?: boolean;

    refill: OneRefillFuelCompanyData['refills'];
    rrn_codes: OneRefillFuelCompanyData['rrn_codes'];
  }
  & WaybillGas
  & WaybillElectrical
  & WaybillRefill
  & WaybillOdometr
  & WaybillMotoHours
);

export type IStateWaybill = {
  waybillList: Array<Waybill>;
};
