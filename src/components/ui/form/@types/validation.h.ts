export interface IValidationSchemaProperties {
  key: string;
  required?: boolean;
  title: string;
  type: 'number' | 'string';
}

export interface IValidationSchema {
  properties: IValidationSchemaProperties[];
}
