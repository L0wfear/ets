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

type CommonFieldType<F extends Record<string, any>, K extends keyof F = keyof F> = {
  title: string;
  required?: boolean;
  dependencies?: Array<
    (value: F[K], formState: F) => any
  >;
};

export type MultiValueOfArrayField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'multiValueOfArray';
};

export type DateTimeField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'datetime';
};

export type DateField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'date';
};

export type BooleanField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'boolean';
};

export type NumberField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'number';

  minLength?: number;
  maxLength?: number;

  min?: number;
  max?: number;

  minNotEqual?: number;

  integer?: boolean;
  float?: number;
};

export type StringField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'string';

  minLength?: number;
  maxLength?: number;
};

export type ValueOfArrayField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'valueOfArray';
};

export type SchemaFormContextBody<F extends object> = {
  validate_fields: {
    [K in keyof F]?: (
      StringField<F, K>
      | ValueOfArrayField<F, K>
      | NumberField<F, K>
      | BooleanField<F, K>
      | DateField<F, K>
      | DateTimeField<F, K>
      | MultiValueOfArrayField<F, K>
    )
  };
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
