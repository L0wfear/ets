import { FieldCommon } from "../common";
import { MaintenanceWork } from "redux-main/reducers/modules/some_uniq/maintenance_work/@types";

/**
 * Схема для типа valueOfArray
 * @param clearable - может ли быть пустым
 */
export type FieldValueOFArrayCommon<F, K extends keyof F> = FieldCommon<K> & {
  clearable?: boolean;
};

/**
 * Тип поля measure_unit_id
 * возможно стоит вынести
 */
export type FieldDataMeasureUnitId = FieldValueOFArrayCommon<
  MaintenanceWork
  | any,
  'measure_unit_id'
>;

/**
 * Все типы valuesOfArray полей
 */
export type FieldsValueOfArray = (
  FieldDataMeasureUnitId
);
