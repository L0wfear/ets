import { ContextFormField } from "./fields";

export type TitleDisplayIf = {
  title: string;
  disaplayIf: (
    'IS_CREATING'
  );
  reverse?: boolean;
};

export type DefaultHeaderType = {
  type: 'default',
  title: TitleDisplayIf[];
};
export type WaybillHeaderType = {
  type: 'waybill',
};
type NewHeaderType = {
  type: never;
  your: any;
  keys: any;
};
/**
 * схема шапки формы
 * для добавления другого формат нужно расшарить тип
 */
export type SchemaFormContextHeader = (
  DefaultHeaderType
  | WaybillHeaderType
  | NewHeaderType
);

export type FieldsRow = Array<ContextFormField>;

export type SchemaFormContextBody = {
  fields: Array<FieldsRow>;
};

/**
 * типы кнопок футера
 */
export type ButtonType = (
  'save'
  | 'cancel'
);
export type ButtonBLock = ButtonType[];

export type DefautlFooterButtons = {
  type: 'default';
  buttons: ButtonBLock[];
};
export type WaybillFooterButtons = {
  type: 'waybill',
};
type NewFooterButtonsType = {
  type: never;
  your: any;
  keys: any;
};
/**
 * схема футера формы
 * если нужно что-то другое, то расшариваем
 */
export type SchemaFormContextFooter = (
  DefautlFooterButtons
  | WaybillFooterButtons
  | NewFooterButtonsType
);

/**
 * схема формы
 */
export type SchemaFormContext<F> = {
  header: SchemaFormContextHeader;
  body: SchemaFormContextBody;
  footer: SchemaFormContextFooter;
};

/**
 * тип formErrors по схеме
 * @todo
 */
export type FormErrorBySchema<F> = any;
