import { isArray } from 'util';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { get } from 'lodash';
import { sortArray } from 'components/@next/@ui/@registry/utils/sort/sort';
import { filterArray } from 'components/@next/@ui/@registry/utils/filter/filter';

export const makeProcessedArray = (array, { sort, filterValues }: Pick<OneRegistryData['list']['processed'], 'sort' | 'filterValues'>, fields: OneRegistryData['filter']['fields']) => {
  let processedArray = filterArray(array, filterValues, fields);

  processedArray = sortArray(processedArray, sort);

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

  return processedArray;
};
