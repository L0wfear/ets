import { Waybill } from "redux-main/reducers/modules/waybill/@types";
import { FieldValueOFArrayCommon } from "../../valueOfArray";

/**
 * Тип поля waybill_stucture_id
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
