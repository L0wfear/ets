import { get } from 'lodash';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export const isAllChecked = (registryData: OneRegistryData) => {
  const userServerFilters = get(registryData, 'Service.getRegistryData.userServerFilters', false);
  const list: any = get(registryData, 'list', null);
  const checkedRowsCurrent: any = get(list, 'data.checkedRows', {});
  const processedArray: any = get(list, 'processed.processedArray', {}) || {};
  const paginator = list?.paginator;
  const perPage = get(paginator, 'perPage', 0);

  let checkArray = processedArray;

  if (!userServerFilters) {
    const offset: any = get(list, 'paginator.currentPage', 0);
    checkArray = processedArray.slice(offset * perPage, (offset + 1) * perPage);
  }

  const count = checkArray.length;

  return count && Object.keys(checkedRowsCurrent).length === count;
};
