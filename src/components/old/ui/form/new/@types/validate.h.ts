import { ExtFieldDate, ExtFieldBoolean, ExtFieldString, ExtFieldNumber } from 'components/@next/@ui/renderFields/@types';

export type DependenciesFieldFunc<K, F, P, T> = (
  value: K,
  formState: F,
  props: P,
  data: T,
) => any;

export type dependenciesDisableFieldFunc<K, F, P, T> = (
  value: K,
  formState: F,
  props: P,
  data: T,
) => any;

export type DependenciesField<K, F, P, T> = Array<DependenciesFieldFunc<K, F, P, T>>;
export type dependenciesDisableField<K, F, P, T> = Array<dependenciesDisableFieldFunc<K, F, P, T>>;

export type CommonPropertie<K, F, P, T> = {
  title: string;
  required?: boolean;
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

  dependencies?: DependenciesField<K, F, P, T>;
  dependenciesDisable?: dependenciesDisableField<K, F, P, T>;
};

export type StringPropertie<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  type: ExtFieldString<K>['type'];
  minLength?: number;
  maxLength?: number;
  trimSpace?: boolean;
  fixedLengthCollection?: Array<number>;
};

export type NumberPropertie<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  type: ExtFieldNumber<K>['type'];
  strick?: boolean; // не преобразовывать в строку, при изменении(handleChange) в withForm
  minLength?: number;
  maxLength?: number;
  min?: number;
  minNotEqual?: number;
  max?: number;
  alt_min?: boolean;
  integer?: boolean;
  float?: number;
  regexp?: string;
  regexpErrorText?: string;
};

export type ValueOfArrayPropertie<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  type: 'valueOfArray';
};

export type MultiValueOfArrayPropertie<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  type: 'multiValueOfArray';
};

export type DatePropertie<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  type: ExtFieldDate<K>['type'];
};
export type DateTimePropertie<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  type: 'datetime';
};

export type BooleanPropertie<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  type: ExtFieldBoolean<K>['type'];
};
export type ObjectProperty<K, P> = {
  type: 'schema';
  schema: SchemaType<K, P>;
};
export type AnyProperty<K, F, P, T> = CommonPropertie<K, F, P, T> & {
  title?: string;
  type: 'any';
};

export type FormErrorType<Shema extends SchemaType<any, any>> = {
  [K in keyof Shema['properties']]: (
    Shema['properties'][K] extends ObjectProperty<any, any>
      ? FormErrorType<Shema['properties'][K]['schema']>
      : (
        Shema['properties'][K] extends AnyProperty<any, any, any, any>
          ? any
          : any
      )
  );
};

export type PropertieFieldValidatorArrType<F, P, T, K = F[keyof F]> = (
    MultiValueOfArrayPropertie<K, F, P, T>
    | ObjectProperty<K, P>
    | StringPropertie<K, F, P, T>
    | NumberPropertie<K, F, P, T>
    | ValueOfArrayPropertie<K, F, P, T>
    | DatePropertie<K, F, P, T>
    | DateTimePropertie<K, F, P, T>
    | BooleanPropertie<K, F, P, T>
    | AnyProperty<K, F, P, T>
);

export type PropertieType<F, P, T = any> = {
  [K in keyof F]?: PropertieFieldValidatorArrType<F, P, T, F[K]>
};

export type SchemaType<F, P, T = any> = {
  properties: PropertieType<F, P, T>;
};
