import { FieldCommon } from "../common";
import { FieldDataWaybillCarId, FieldDataWaybillTrailerId, FieldDataWaybillWorkModeId, FieldDataWaybillDriverId, FieldDataWaybillIsBnsoBroken } from "./valueOfArray";

/**
 * Тип для компонента с Подразделение, датами и сопровождающим
 */
export type FieldDataWaybillEemployeeChangeStatus = FieldCommon<'waybill_employee_change_status'>;
export type FieldDataWaybillStructureAndAccompanyingPerson = FieldCommon<'waybill_structure_and_accompanying_person'>;
export type FieldDataWaybillMissions = FieldCommon<'waybill_missions'>;
export type FieldDataWaybillIdleTimeOnLine = FieldCommon<'waybill_idle_time_on_line'>;

export type FieldDataWaybillDates= FieldCommon<'waybill_dates'>;
/**
 * Типчики всех полей ПЛ первого уровня
 */
export type FieldsWaybill = (
  FieldDataWaybillEemployeeChangeStatus
  | FieldDataWaybillStructureAndAccompanyingPerson
  | FieldDataWaybillDates
  | FieldDataWaybillMissions
  | FieldDataWaybillCarId
  | FieldDataWaybillTrailerId
  | FieldDataWaybillDriverId
  | FieldDataWaybillWorkModeId
  | FieldDataWaybillIsBnsoBroken
  | FieldDataWaybillIdleTimeOnLine
);
