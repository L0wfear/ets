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
  | NewHeaderType
);

/**
 * Дефолтное значение для всех типов полей
 * @param title - label поля
 * @param required - обязательно для заполнения или нет
 */
export type FieldCommon = {
  title: string;
  required?: boolean,
};
/**
 * Схема для типа stirng
 * @param minLength - минимальная длина строки
 * @param maxLength - максимальная длина строки
 */
export type FieldString<F, K extends keyof F> = FieldCommon & {
  type: 'string';
  minLength?: number;
  maxLength?: number;
};
/**
 * Схема для типа valueOfArray
 * @param clearable - может ли быть пустым
 */
export type FieldValueOFArray<F, K extends keyof F> = FieldCommon & {
  type: 'valueOfArray';
  clearable?: boolean;
};
/**
 * Схема для типа valueOfArray
 * @param schemaBody - схема для этого объекта
 */
export type ObjectProperty<F, K extends keyof F> = FieldCommon & {
  type: 'schema';
  schemaBody: SchemaFormContextBody<F[K]>;
};

/**
 * поля схемы
 * если свойство является объектом, то поле должно отвечать схеме, иначе обычное
 */
export type Field<F, K extends keyof F> = (
  F[K] extends object
    ? ObjectProperty<F, K>
    : FieldString<F, K>
      | FieldValueOFArray<F, K>
);

export type SchemaFormContextBody<F> = {
  fields: Partial<Record<keyof F, Field<F, keyof F>>>;
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
/**
 * схема футера формы
 * если нужно что-то другое, то расшариваем
 */
export type SchemaFormContextFooter = (
  DefautlFooterButtons
);

/**
 * схема формы
 */
export type SchemaFormContext<F> = {
  header: SchemaFormContextHeader;
  body: SchemaFormContextBody<F>;
  footer: SchemaFormContextFooter;
};

/**
 * тип formErrors по схеме
 */
export type FormErrorBySchema<F, SchemaBodyFields extends SchemaFormContextBody<any>, RootFormState> = (
  {
    [K in keyof SchemaBodyFields['fields']]?: (
      string
    );
  }
);
