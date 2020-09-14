import { isObject, isNullOrUndefined } from 'util';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { createValidDateTime, getDateWithMoscowTz, getTomorrow9am } from 'components/@next/@utils/dates/dates';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

import { WaybillGas } from 'redux-main/reducers/modules/waybill/@types/index';

export const gasDefaultElement: WaybillGas = {
  // gas
  gas_fuel_type: null, // Тип топлива
  gas_fuel_start: null, // Выезд, л
  gas_fuel_given: null, // Выдано, л
  gas_fuel_end: null, // Возврат по таксировке, л
  gas_fact_fuel_end: null, // Возврат фактический, л
  gas_tax_data: [], // Расчет по норме
  gas_refill: [], // Заправки

  // Расчетные поля (только GET), не храним в бд
  gas_tax_consumption: null, // Расход по таксировке, л
  gas_fact_consumption: null, // Расход фактический, л
  gas_diff_consumption: null, // Расхождение в данных расхода, л
};

export const getDefaultWaybill = (company_id): Waybill => ({
  accompanying_person_id: null,
  accompanying_person_name: '',
  activated_by_employee_id: null,
  activated_by_employee_name: '',
  all_missions_completed_or_failed: false,
  all_missions_status: '',
  can_delete_missions: true,
  car_id: null,
  car_model_id: null,
  car_model_name: '',
  car_type_id: null,
  car_type_name: '',
  car_gps_code: '',
  car_refill: [],
  car_special_model_id: null,
  car_special_model_name: '',
  closed_by_employee_id: null,
  closed_by_employee_name: '',
  closed_editable: false,
  closing_date: '',
  comment: '',
  company_id,
  company_name: null,
  created_by_employee_id: null,
  created_by_employee_name: '',
  date_create: '',
  downtime_hours_dinner: null,
  downtime_hours_duty: null,
  downtime_hours_repair: null,
  downtime_hours_work: null,
  driver_id: null,
  driver_fio: '',
  driver_name: '',
  driver_personnel_number: '',
  delete: false,
  equipment_fact_fuel_end: null,
  equipment_fuel: null,
  equipment_fuel_end: null,
  equipment_fuel_given: null,
  equipment_fuel_start: null,
  equipment_fuel_to_give: null,
  equipment_fuel_type: 'DT',
  equipment_refill: [],
  equipment_tax_data: [],
  fact_arrival_date: '',
  fact_departure_date: '',
  fact_fuel_end: null,
  failed_medical_stat_types: false,
  files: [],
  fuel_end: null,
  fuel_given: null,
  fuel_start: null,
  fuel_to_give: null,
  fuel_type: 'DT',
  garage_number: '',
  gov_number: '',
  id: null,
  is_bnso_broken: null,
  is_one_fuel_tank: true,
  is_edited_odometr: false,
  is_edited_motohours: false,
  is_edited_motohours_equip: false,
  mission_id_list: [],
  motohours_end: null,
  motohours_equip_diff: null,
  motohours_equip_end: null,
  motohours_equip_start: null,
  motohours_equip_reason_id: null,
  motohours_start: null,
  motohours_reason_id: null,
  number: null,
  odometr_end: null,
  odometr_start: null,
  odometr_reason_id: null,
  okrug_id: null,
  okrug_name: null,
  plan_arrival_date: createValidDateTime(getTomorrow9am()),
  plan_departure_date: createValidDateTime(getDateWithMoscowTz()),
  sensor_consumption: null,
  sensor_leak: null,
  sensor_refill: null,
  sensor_start_value: null,
  sensor_finish_value: null,
  status: 'draft',
  status_text: '',
  structure_id: null,
  structure_name: '',
  tax_data: [],
  season: null,
  track_length: null,
  track_length_km: null,
  trailer_id: null,
  trailer_type_id: null,
  trailer_type_name: '',
  trailer_gps_code: '',
  trailer_gov_number: '',
  trailer_model_id: null,
  trailer_model_name: '',
  trailer_special_model_id: null,
  trailer_special_model_name: '',
  work_mode_id: null,
  work_mode_name: '',
  work_mode_text: '',
  hasEquipmentFuelRates: null,
  fuel_card_ids: null,
  refill_type_ids: null,
  car_has_motohours: null,
  car_has_odometr: null,
  engine_kind_ids: [],
  ...gasDefaultElement,
});

export const getDefaultWaybillElement = (element: Partial<Waybill>, sessionData: InitialStateSession): Waybill => {
  const newElement = { ...getDefaultWaybill(sessionData.userData.company_id) };
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : newElement[key];
    });
  }

  return newElement;
};
