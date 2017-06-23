import { IDataTableColSchema } from 'components/ui/table/@types/schema.h';

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

export type ICommonSchemaMakerFunction = (schema: IDataTableColSchema) => IDataTableColSchema;

/**
 * Преобразовываем параметры урла в валидные для селект-листа данные.
 */
export function parseMultiSelectListQueryParams(query: any, params: Array<string> = []): any {
  if (Object.keys(query).length === 0) {
    return query;
  }

  return params.map(p => {

    const paramValue = query[p] || '';

    const newQuery = paramValue === '' ? {
      [p]: paramValue,
    } : {
      [p]: JSON.parse(paramValue),
    };

    return newQuery;
  })
  .reduce((prev, curr) => ({ ...prev, ...curr }), query);
}
