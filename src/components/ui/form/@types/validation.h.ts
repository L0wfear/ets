export interface IValidationSchemaProperties {
  key: string;
  required?: boolean;
  title: string;
  type: 'number' | 'string' | 'date';
}

export interface IValidationSchema {
  properties: IValidationSchemaProperties[];
}
