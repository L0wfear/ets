import { FieldsString } from "./string";
import { FieldsWaybill } from "./waybill";

/**
 * поля схемы
 * если свойство является объектом, то поле должно отвечать схеме, иначе обычное
 */
export type ContextFormField = (
  FieldsString
  | FieldsWaybill
);
