import { isArray } from 'lodash';

import { IDataTableColSchema } from 'components/ui/table/@types/schema.h';

/**
 * Когда с сервера будут приходить типы полей, то такая штука будет не нужна.
 */
export const defaultSchemaMaker = (list: any[] = []) => (schema: IDataTableColSchema): IDataTableColSchema => {
  if (list.length === 0) {
    return schema;
  }

  if (isArray(list[0][schema.name])) {
    return {
      ...schema,
        filter: {
          type: 'string',
        },
    };
  }

  return schema;
};

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

  return params.map((p) => {

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
