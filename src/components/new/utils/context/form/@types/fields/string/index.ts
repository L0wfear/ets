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
 * Тип поля is_bnso_broken
 * возможно стоит вынести
 */
export type FieldDataIsBnsoBroken = FieldStringCommon<
  Waybill
  | any,
  'is_bnso_broken'
>;

/**
 * Все типы string полей
 */
export type FieldsString = (
  FieldDataName
  | FieldDataIsBnsoBroken
);
