import { get } from 'lodash';
import { OneRegistryData } from '../registry';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';

export const isAllChecked = (registryData: OneRegistryData) => {
  const userServerFilters = get(registryData, 'Service.getRegistryData.userServerFilters', false);
  const list: any = get(registryData, 'list', null);
  const checkedRowsCurrent: any = get(list, 'data.checkedRows', {});
  const processedArray: any = get(list, 'processed.processedArray', {}) || {};

  let checkArray = processedArray;

  if (!userServerFilters) {
    const offset: any = get(list, 'paginator.currentPage', 0);
    checkArray = processedArray.slice(offset * MAX_ITEMS_PER_PAGE, (offset + 1) * MAX_ITEMS_PER_PAGE);
  }

  const count = checkArray.length;

  return count && Object.keys(checkedRowsCurrent).length === count;
};
