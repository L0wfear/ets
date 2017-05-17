import { IDataTableColSchema } from 'components/ui/table/@types/DataTable/schema.h';

export function multiselectFilterSchema(schema: IDataTableColSchema): IDataTableColSchema {
  return {
    ...schema,
    filter: {
      type: 'multiselect',
    },
  };
}

export function noFilterSchema(schema: IDataTableColSchema): IDataTableColSchema {
  return {
    ...schema,
    filter: false,
  };
}

type ICommonSchemaMakerFunction = (schema: IDataTableColSchema) => IDataTableColSchema;

interface ICommonSchemaMakers {
  okrug_name: ICommonSchemaMakerFunction;
  district_name: ICommonSchemaMakerFunction;
  company_name: ICommonSchemaMakerFunction;
}

export const commonSchemaMakers: ICommonSchemaMakers = {
  okrug_name: schema => multiselectFilterSchema(schema),
  district_name: schema => multiselectFilterSchema(schema),
  company_name: schema => multiselectFilterSchema(schema),
};
