import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';

const registryDefaultObj: OneRegistryData = {
  Service: {
    getRegistryData: {
      payload: {},
    },
  },
  filter: {
    fields: [],
    isOpen: false,
    rawFilterValues: {},
  },
  header: {
    buttons: [],
    format: 'default',
    title: '',
  },
  list: {
    data: {
      array: [],
      arrayExtra: {},
      total_count: 0,
      uniqKey: 'id',
      uniqKeyForParams: 'id',
      selectedRow: null,
      checkedRows: {},
      fixedWidth: false,
    },
    permissions: {
      list: false,
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    meta: {
      fields: [],
      fieldsInDeepArr: [],
      rowFields: [],
      treeFields: {},
    },
    paginator: {
      currentPage: 0,
      perPage: MAX_ITEMS_PER_PAGE,
    },
    processed: {
      filterValues: {},
      processedArray: [],
      sort: {
        field: '',
        reverse: false,
      },
      total_count: 0,
    },
  },
};

export default registryDefaultObj;
