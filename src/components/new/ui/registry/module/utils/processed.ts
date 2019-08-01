import { isNullOrUndefined, isArray } from 'util';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { get } from 'lodash';
import { sortArray } from 'components/@next/@ui/@registry/utils/sort/sort';
import { filterArray } from 'components/@next/@ui/@registry/utils/filter/filter';

export const makeProcessedArray = (array, { sort, filterValues }: Pick<OneRegistryData['list']['processed'], 'sort' | 'filterValues'>, fields: OneRegistryData['filter']['fields']) => {
  let processedArray = filterArray(array, filterValues, fields);

  if (sort.field) {
    if (processedArray.some(({ [sort.field]: fieldValue }: any) => !isNullOrUndefined(fieldValue))) {
      processedArray.sort((a, b) =>
        sortArray(
          sort.reverse ? b : a,
          sort.reverse ? a : b,
          sort.field,
        ),
      );
    }

    if (processedArray.some(({ children }) => isArray(children) && children.length)) {
      processedArray = processedArray.map((rowData) => {
        const children = get(rowData, 'children', null);
        if (children) {
          const rowDataTemp =  {
            ...rowData,
            children: makeProcessedArray(children, { sort, filterValues }, fields),
          };

          rowDataTemp.is_open = false;

          return rowDataTemp;
        }
      });
    }
  }

  return processedArray;
};
