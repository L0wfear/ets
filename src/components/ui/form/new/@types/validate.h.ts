export type CommonPropertie<F> = {
  key: keyof F;
  title: string;
  required?: boolean;
};

export type StringPropertie<F> = CommonPropertie<F> & {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  trimSpace?: boolean;
};

export type NumberPropertie<F> = CommonPropertie<F> & {
  type: 'number';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  integer?: boolean;
  float?: number;
};

export type ValueOfArrayPropertie<F> = CommonPropertie<F> & {
  type: 'valueOfArray';
};

export type MultiValueOfArrayPropertie<F> = CommonPropertie<F> & {
  type: 'multiValueOfArray';
};

export type DatePropertie<F> = CommonPropertie<F> & {
  type: 'date';
};
export type DateTimePropertie<F> = CommonPropertie<F> & {
  type: 'datetime';
};

export type BooleanPropertie<F> = CommonPropertie<F> & {
  type: 'boolean';
};

export type PropertieType<F> = (
  StringPropertie<F>
  | NumberPropertie<F>
  | ValueOfArrayPropertie<F>
  | MultiValueOfArrayPropertie<F>
  | DatePropertie<F>
  | DateTimePropertie<F>
  | BooleanPropertie<F>
);

export type DependencieValidatorType<F, P, K = any> = (
  value: K,
  formState: F,
  props: P,
) => string | void;

export type DependencieFieldValidatorArrType<F, P, K = any> = DependencieValidatorType<F, P, K>[];

export type DependencieType<F, P> = {
  [K in keyof F]?: DependencieFieldValidatorArrType<F, P, F[K]>
};

export type SchemaType<F, P> = {
  properties: PropertieType<F>[],
  dependencies?: DependencieType<F, P>;
};

export type ValidateFuncType<F, P> = (
  shema: SchemaType<F, P>,
  formState: F,
  props: P,
) => {
  [key: string]: string | void;
};
