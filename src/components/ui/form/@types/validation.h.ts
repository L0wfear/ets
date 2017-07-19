export interface IValidationSchemaProperties {
  key: string;
  required?: boolean;
  title: string;
  type: 'number' | 'string' | 'date' | 'datetime';
}

export interface IValidationSchema {
  properties: IValidationSchemaProperties[];
}
