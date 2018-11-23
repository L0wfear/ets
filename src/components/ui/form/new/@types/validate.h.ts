export type PropertieType = {
  key: string;
  title: string;
  type: 'string'
  | 'number';
  required?: boolean;
};

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
  properties: PropertieType[],
  dependencies: DependencieType<F, P>;
};

export type ValidateFuncType<F, P> = (
  shema: SchemaType<F, P>,
  formState: F,
  props: P,
) => {
  [key: string]: string | void;
};
