import { FieldCommon } from "../common";
import { MaintenanceWork } from "redux-main/reducers/modules/some_uniq/maintenance_work/@types";
import { Waybill } from "redux-main/reducers/modules/waybill/@types";

/**
 * Схема для типа stirng
 * @param minLength - минимальная длина строки
 * @param maxLength - максимальная длина строки
 */
export type FieldStringCommon<F, K extends keyof F> = FieldCommon<K> & {
  minLength?: number;
  maxLength?: number;
};

/**
 * Тип поля name
 * возможно стоит вынести
 */
export type FieldDataName = FieldStringCommon<
  MaintenanceWork
  | any,
  'name'
>;

/**
 * Тип поля downtime_hours_work
 * возможно стоит вынести
 */
export type FieldDataDowntimeHoursWork = FieldStringCommon<
  Waybill
  | any,
  'downtime_hours_work'
>;

/**
 * Тип поля downtime_hours_duty
 * возможно стоит вынести
 */
export type FieldDataDowntimeHoursDuty = FieldStringCommon<
  Waybill
  | any,
  'downtime_hours_duty'
>;

/**
 * Тип поля downtime_hours_dinner
 * возможно стоит вынести
 */
export type FieldDataDowntimeHoursDinner = FieldStringCommon<
  Waybill
  | any,
  'downtime_hours_dinner'
>;

/**
 * Тип поля downtime_hours_repair
 * возможно стоит вынести
 */
export type FieldDataDowntimeHoursRepair = FieldStringCommon<
  Waybill
  | any,
  'downtime_hours_repair'
>;

/**
 * Все типы string полей
 */
export type FieldsString = (
  FieldDataName
  | FieldDataDowntimeHoursWork
  | FieldDataDowntimeHoursDuty
  | FieldDataDowntimeHoursDinner
  | FieldDataDowntimeHoursRepair
);
