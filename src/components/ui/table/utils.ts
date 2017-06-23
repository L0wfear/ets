/**
 * Утилиты для работы с таблицей
 */
import { prop, indexBy } from 'ramda';
import { mapKeys, get, isEmpty } from 'lodash';

import { IDataTableSchema, IExtractedDataTableSchema, IDataTableColSchema } from 'components/ui/table/@types/schema.h';

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
