import { FieldCommon } from "../common";

/**
 * Тип для компонента с Подразделение, датами и сопровождающим
 */
export type FieldDataWaybillEemployeeChangeStatus = FieldCommon<'waybill_employee_change_status'>;
export type FieldDataWaybillStructureAndAccompanyingPerson = FieldCommon<'waybill_structure_and_accompanying_person'>;

export type FieldDataWaybillDates= FieldCommon<'waybill_dates'>;
/**
 * Типчики всех полей ПЛ первого уровня
 */
export type FieldsWaybill = (
  FieldDataWaybillEemployeeChangeStatus
  | FieldDataWaybillStructureAndAccompanyingPerson
  | FieldDataWaybillDates
);
