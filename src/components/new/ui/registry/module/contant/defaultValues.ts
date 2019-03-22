import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';

const registryDefaultObj: OneRegistryData = {
  Service: {
    get: null,
  },
  filter: {
    fields: [],
    isOpen: false,
    rawFilterValues: {},
  },
  header: {
    buttons: [],
    title: '',
  },
  list: {
    data: {
      array: [],
      total_count: 0,
      uniqKey: 'id',
      selectedRow: null,
      checkedRows: {},
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
