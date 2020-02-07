import { ExtFieldDate, ExtFieldBoolean, ExtFieldString, ExtFieldNumber } from 'components/@next/@ui/renderFields/@types';

export type DependenciesFieldFunc<K, F, P> = (
  value: K,
  formState: F,
  props: P,
) => any;

export type dependenciesDisableFieldFunc<K, F, P> = (
  value: K,
  formState: F,
  props: P,
) => any;

export type DependenciesField<K, F, P> = Array<DependenciesFieldFunc<K, F, P>>;
export type dependenciesDisableField<K, F, P> = Array<dependenciesDisableFieldFunc<K, F, P>>;

export type CommonPropertie<K, F, P> = {
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

  dependencies?: DependenciesField<K, F, P>;
  dependenciesDisable?: dependenciesDisableField<K, F, P>;
};

export type StringPropertie<K, F, P> = CommonPropertie<K, F, P> & {
  type: ExtFieldString<K>['type'];
  minLength?: number;
  maxLength?: number;
  trimSpace?: boolean;
  fixedLengthCollection?: Array<number>;
};

export type NumberPropertie<K, F, P> = CommonPropertie<K, F, P> & {
  type: ExtFieldNumber<K>['type'];
  strick?: boolean; // не преобразовывать в строку, при изменении(handleChange) в withForm
  minLength?: number;
  maxLength?: number;
  min?: number;
  minNotEqual?: number;
  max?: number;
  integer?: boolean;
  float?: number;
  regexp?: string;
  regexpErrorText?: string;
};

export type ValueOfArrayPropertie<K, F, P> = CommonPropertie<K, F, P> & {
  type: 'valueOfArray';
};

export type MultiValueOfArrayPropertie<K, F, P> = CommonPropertie<K, F, P> & {
  type: 'multiValueOfArray';
};

export type DatePropertie<K, F, P> = CommonPropertie<K, F, P> & {
  type: ExtFieldDate<K>['type'];
};
export type DateTimePropertie<K, F, P> = CommonPropertie<K, F, P> & {
  type: 'datetime';
};

export type BooleanPropertie<K, F, P> = CommonPropertie<K, F, P> & {
  type: ExtFieldBoolean<K>['type'];
};
export type ObjectProperty<K, P> = {
  type: 'schema';
  schema: SchemaType<K, P>;
};
export type AnyProperty<K, F, P> = CommonPropertie<K, F, P> & {
  title?: string;
  type: 'any';
};

export type FormErrorType<Shema extends SchemaType<any, any>> = {
  [K in keyof Shema['properties']]: (
    Shema['properties'][K] extends ObjectProperty<any, any>
      ? FormErrorType<Shema['properties'][K]['schema']>
      : (
        Shema['properties'][K] extends AnyProperty<any, any, any>
          ? any
          : any
      )
  );
};

export type PropertieFieldValidatorArrType<F, P, K = F[keyof F]> = (
    MultiValueOfArrayPropertie<K, F, P>
    | ObjectProperty<K, P>
    | StringPropertie<K, F, P>
    | NumberPropertie<K, F, P>
    | ValueOfArrayPropertie<K, F, P>
    | DatePropertie<K, F, P>
    | DateTimePropertie<K, F, P>
    | BooleanPropertie<K, F, P>
    | AnyProperty<K, F, P>
);

export type PropertieType<F, P> = {
  [K in keyof F]?: PropertieFieldValidatorArrType<F, P, F[K]>
};

export type SchemaType<F, P> = {
  properties: PropertieType<F, P>;
};
