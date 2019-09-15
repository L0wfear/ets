/**
 * схема шапки формы
 * для добавления другого формат нужно расшарить тип
 */
type SchemaFormContextHeader = {
  title: {
    create: string;
    update: string;
  };
};

type CommonFieldType = {
  title: string;
  required?: boolean;
};

export type MultiValueOfArrayField = CommonFieldType & {
  type: 'multiValueOfArray',
};

export type DateTimeField = CommonFieldType & {
  type: 'datetime',
};

export type DateField = CommonFieldType & {
  type: 'date',
};

export type BooleanField = CommonFieldType & {
  type: 'boolean',
};

export type NumberField = CommonFieldType & {
  type: 'number',

  minLength?: number;
  maxLength?: number;

  min?: number;
  max?: number;

  minNotEqual?: number;

  integer?: boolean;
  float?: number;
};

export type StringField = CommonFieldType & {
  type: 'string',

  minLength?: number;
  maxLength?: number;
};

export type ValueOfArrayField = CommonFieldType & {
  type: 'valueOfArray',
};

export type SchemaFormContextBody<F extends object> = {
  fields: {
    [K in keyof F]?: (
      StringField
      | ValueOfArrayField
      | NumberField
      | BooleanField
      | DateField
      | DateTimeField
      | MultiValueOfArrayField
    )
  },
};

/**
 * схема формы
 */
export type SchemaFormContext<F extends object> = {
  header: SchemaFormContextHeader;
  body: SchemaFormContextBody<F>;
};

/**
 * тип formErrors по схеме
 * @todo
 */
export type FormErrorBySchema<F> = any;
