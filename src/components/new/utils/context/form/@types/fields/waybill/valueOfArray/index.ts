import { Waybill } from "redux-main/reducers/modules/waybill/@types";
import { FieldValueOFArrayCommon } from "../../valueOfArray";

/**
 * Тип поля stucture_id
 * возможно стоит вынести
 */
export type FieldDataWaybillStuctureId = FieldValueOFArrayCommon<
  Waybill
  | any,
  'structure_id'
>;

/**
 * Тип поля accompanying_person_id
 * возможно стоит вынести
 */
export type FieldDataWaybillAccompanyingPersonId = FieldValueOFArrayCommon<
  Waybill
  | any,
  'accompanying_person_id'
>;

/**
 * Тип поля car_id
 * возможно стоит вынести
 */
export type FieldDataWaybillCarId = FieldValueOFArrayCommon<
  Waybill
  | any,
  'waybill_car_id'
>;

/**
 * Тип поля trailer_id
 * возможно стоит вынести
 */
export type FieldDataWaybillTrailerId = FieldValueOFArrayCommon<
  Waybill
  | any,
  'waybill_trailer_id'
>;

/**
 * Тип поля driver_id
 * возможно стоит вынести
 */
export type FieldDataWaybillDriverId = FieldValueOFArrayCommon<
  Waybill
  | any,
  'waybill_driver_id'
>;

/**
 * Тип поля work_mode_id
 * возможно стоит вынести
 */
export type FieldDataWaybillWorkModeId = FieldValueOFArrayCommon<
  Waybill
  | any,
  'waybill_work_mode_id'
>;

/**
 * Тип поля is_bnso_broken
 * возможно стоит вынести
 */
export type FieldDataWaybillIsBnsoBroken = FieldValueOFArrayCommon<
  Waybill
  | any,
  'is_bnso_broken'
>;
