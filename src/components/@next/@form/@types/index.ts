import { ReduxState } from 'redux-main/@types/state';

/**
 * схема шапки формы
 * для добавления другого формат нужно расшарить тип
 */
type SchemaFormContextHeader = {
  title?: {
    create: string;
    update: string;
  };
};

type CommonFieldType<F extends Record<string, any>, K extends keyof F = keyof F> = {
  title: string;
  required?: boolean;
  dependencies?: Array<
    (value: F[K], formState: F, reduxState: ReduxState) => FormErrorBySchema<F>[K]
  >;

  validateIf?: (
    {
      type: 'has_data';
      path: string; // path.to.path | get(rootState, validateIf, false)
      reverse?: boolean;
    }
    | {
      type: 'equal_to_value';
      path: string; // path.to.path | get(rootState, validateIf, false)
      value: any;
      reverse?: boolean;
    }
    | {
      type: 'fixed_length';
      path: string; // path.to.path | get(rootState, validateIf, false)
      value: any;
      reverse?: boolean;
    }
  ) | (
    Array<(
      {
        type: 'has_data';
        path: string; // path.to.path | get(rootState, validateIf, false)
        reverse?: boolean;
      }
      | {
        type: 'equal_to_value';
        path: string; // path.to.path | get(rootState, validateIf, false)
        value: any;
        reverse?: boolean;
      }
    )>
  );
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
  alt_min?: boolean;

  minNotEqual?: number;

  integer?: boolean;
  float?: number;

  regexp?: string;          // регулярка которой число должно соответствовать
  regexpErrorText?: string;
};

export type StringField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'string';

  minLength?: number;
  maxLength?: number;

  fixedLengthCollection?: Array<number>;
};

export type ValueOfArrayField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'valueOfArray';
};

export type SchemaField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'schema';
  validate_fields: SchemaFormContextBody<F[K]>['validate_fields'];
};

export type AnyField<F extends Record<string, any>, K extends keyof F = keyof F> = CommonFieldType<F, K> & {
  type: 'any';
};

export type SchemaFormContextBody<F extends Record<string, any>> = {
  validate_fields: {
    [K in keyof F]?: (
      StringField<F, K>
      | SchemaField<F, K>
      | ValueOfArrayField<F, K>
      | NumberField<F, K>
      | BooleanField<F, K>
      | DateField<F, K>
      | DateTimeField<F, K>
      | MultiValueOfArrayField<F, K>
      | AnyField<F, K>
    )
  };
};

/**
 * схема формы
 */
export type SchemaFormContext<F extends Record<string, any>> = {
  header: SchemaFormContextHeader;
  body: SchemaFormContextBody<F>;
};

/**
 * тип formErrors по схеме
 * @todo
 */
export type FormErrorBySchema<F extends Record<string, any>> = Partial<Record<keyof F, string | any>>;
