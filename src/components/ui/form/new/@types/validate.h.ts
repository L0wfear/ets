export type CommonPropertie = {
  title: string;
  required?: boolean;
};

export type StringPropertie = CommonPropertie & {
  type: 'string';
  minLength?: number;
  maxLength?: number;
};

export type NumberPropertie = CommonPropertie & {
  type: 'number';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  integer?: boolean;
  float?: number;
};

export type ValueOfArrayPropertie = CommonPropertie & {
  type: 'valueOfArray';
};

export type MultiValueOfArrayPropertie = CommonPropertie & {
  type: 'multiValueOfArray';
};

export type DatePropertie = CommonPropertie & {
  type: 'date';
};
export type DateTimePropertie = CommonPropertie & {
  type: 'datetime';
};

export type BooleanPropertie = CommonPropertie & {
  type: 'boolean';
};
export type ObjectProperty<F, P> = {
  type: 'schema';
  schema: SchemaType<F, P>;
};

export type FormErrorType<F> = {
  [K in keyof F]?: (
    F[K] extends Array<any>
      ? string
      : F[K] extends { [k: string]: any }
        ? FormErrorType<F[K]>
        : string
  );
};

export type PropertieFieldValidatorArrType<F, P, K = F[keyof F]> = (
  K extends Array<any>
    ? (
      MultiValueOfArrayPropertie
    )
    : (
      K extends { [k: string]: any }
        ? (
          ObjectProperty<K, P>
        )
        : (
          StringPropertie
          | NumberPropertie
          | ValueOfArrayPropertie
          | DatePropertie
          | DateTimePropertie
          | BooleanPropertie
        )
    )
);

export type PropertieType<F, P> = {
  [K in keyof F]?: PropertieFieldValidatorArrType<F, P, F[K]>
};

export type DependencieValidatorType<F, P, K = F[keyof F]> = (
  value: K,
  formState: F,
  props: P,
) => (
  K extends Array<any>
      ? string
      : K extends { [k: string]: any }
        ? FormErrorType<K>
        : string
);

export type DependencieFieldValidatorArrType<F, P, K = F[keyof F]> = DependencieValidatorType<F, P, K>[];

export type DependencieType<F, P> = {
  [K in keyof F]?: DependencieFieldValidatorArrType<F, P, F[K]>
};

export type SchemaType<F, P> = {
  properties: PropertieType<F, P>,
  dependencies?: DependencieType<F, P>;
};

export type ValidateFuncType<F, P> = (
  shema: SchemaType<F, P>,
  formState: F,
  props: P,
) => {
  [key: string]: FormErrorType<F>;
};
