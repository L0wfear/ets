/**
 * Утилиты для работы с таблицей
 */
import { prop, indexBy } from 'ramda';
import { mapKeys, get, isEmpty, identity, sortBy } from 'lodash';

import { IDataTableSchema, IExtractedDataTableSchema, IDataTableColSchema, ISchemaMaker } from 'components/ui/table/@types/schema.h';

export function extractTableMeta(columnMeta: IDataTableSchema): IExtractedDataTableSchema {
  return indexBy<IDataTableColSchema, IExtractedDataTableSchema>(prop('name'), columnMeta.cols);
}

export function getServerSortingField(sourceField: string, direction: string, serverFieldName: string = null): string {
  const resultField = serverFieldName === null ? sourceField : serverFieldName;

  return `${resultField}:${direction ? 'asc' : 'desc'}`;
}

export function toServerFilteringObject<FilterItem = any>(
  filterObject: ETSCore.Types.IStringKeyHashTable<FilterItem>,
  tableMeta: IExtractedDataTableSchema,
): ETSCore.Types.IStringKeyHashTable<FilterItem> {
  if (isEmpty(tableMeta)) { return filterObject; }

  return mapKeys(filterObject, (value, key) => {
    const serverFieldName = get(tableMeta, [key, 'filter', 'serverFieldName']);

    return serverFieldName === undefined ? key : serverFieldName;
  });
}

export function makeSchema({ cols = [] }: IDataTableSchema, makers: ISchemaMaker): IDataTableSchema {
  const newCols = cols.map(col => {
    const maker = makers[col.name] || identity;
    return maker(col);
  });

  return { cols: newCols };
}

export function sortSchemaCols({ cols = [] }: IDataTableSchema, key: string = 'orderNum'): IDataTableSchema {
  return { cols: sortBy<IDataTableColSchema>(cols, key) };
}

export function hiddeColumns(schema: IDataTableColSchema): IDataTableColSchema {
  return ({ ...schema, display: false });
}
