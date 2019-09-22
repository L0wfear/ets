import { FieldsString } from 'components/@next/@form/@types/fields/string';
import { FieldsWaybill } from 'components/@next/@form/@types/fields/waybill';

/**
 * поля схемы
 * если свойство является объектом, то поле должно отвечать схеме, иначе обычное
 */
export type ContextFormField = (
  FieldsString
  | FieldsWaybill
);
