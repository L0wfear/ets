interface IValidationSchemaProperties<TValue, TFormData> {
  key: string;
  required?: boolean;
  float?: number;
  integer?: boolean;
  title?: string;
  maxLength?: number;
  minLength?: number;
  equalLength?: number;
  max?: number;
  min?: number;
  isSubmitted?(value: TValue, formData: TFormData): boolean;
  type?:
    'number' |
    'string' |
    'date' |
    'datetime'|
    'boolean' |
    'array'
  ;
}

interface IValidationSchemaDependensyField<TValue, TFormData> {
  validator?(value: TValue, formData: TFormData): boolean | string;
}
interface IValidationSchemaDependencies<TValue, TFormData> {
  [field: string]: IValidationSchemaDependensyField<TValue, TFormData>[];
}

export interface IValidationSchema<TValue = any, TFormData = any> {
  properties: IValidationSchemaProperties<TValue, TFormData>[];
  dependencies?: IValidationSchemaDependencies<TValue, TFormData>;
}
