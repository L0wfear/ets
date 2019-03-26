import { get } from 'lodash';
import { OneRegistryData } from '../registry';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';

export const isAllChecked = (registryData: OneRegistryData) => {
  const getRegistryData = get(registryData, 'Service.getRegistryData', null);
  const list: any = get(registryData, 'list', null);
  const offset: any = get(list, 'paginator.currentPage', 0);
  const checkedRowsCurrent: any = get(list, 'data.checkedRows', {});
  const processedArray: any = get(list, 'processed.processedArray', {}) || {};

  let checkArray = processedArray;

  if (!getRegistryData.userServerFilters) {
    checkArray = processedArray.slice(offset, MAX_ITEMS_PER_PAGE);
  }

  const count = checkArray.length;

  return count && Object.keys(checkedRowsCurrent).length === count;
};
