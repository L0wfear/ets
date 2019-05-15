import { FieldsString } from "./string";
import { FieldsValueOfArray } from "./valueOfArray";

/**
 * поля схемы
 * если свойство является объектом, то поле должно отвечать схеме, иначе обычное
 */
export type ContextFormField = (
  FieldsString
  | FieldsValueOfArray
);
