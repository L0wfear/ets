type IValidationSchemaProperties<TValue, TFormData> = {
  key: string;
  required?: boolean;
  float?: number;
  integer?: boolean;
  title?: string;
  maxLength?: number;
  minLength?: number;
  equalLength?: number;
  trimSpace?: boolean;
  max?: number;
  min?: number;
  isSubmitted?(value: TValue, formData: TFormData): boolean;
  type?:
    'number' |
    'string' |
    'text' |
    'date' |
    'datetime'|
    'boolean' |
    'array'
  ;
};

type IValidationSchemaDependensyField<TValue, TFormData> = {
  validator?(value: TValue, formData: TFormData): boolean | string;
};
type IValidationSchemaDependencies<TValue, TFormData> = {
  [field: string]: Array<IValidationSchemaDependensyField<TValue, TFormData>>;
};

export type IValidationSchema<TValue = any, TFormData = any> = {
  properties: Array<IValidationSchemaProperties<TValue, TFormData>>;
  dependencies?: IValidationSchemaDependencies<TValue, TFormData>;
};
