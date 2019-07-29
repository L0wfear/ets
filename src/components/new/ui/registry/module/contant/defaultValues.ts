import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';

const registryDefaultObj: OneRegistryData = {
  idRequestTime: 1,
  isLoading: false,
  Service: {
    getRegistryData: {
      payload: {},
    },
    getOneData: null,
  },
  filter: {
    fields: [],
    isOpen: false,
    rawFilterValues: {},
  },
  header: {
    buttons: [],
    format: 'default',
    is_current_structure_popover: '',
    title: '',
    titlePopover: '',
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
      proxyCheckData: null,
    },
    permissions: {
      list: false,
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    meta: {
      row_double_click: true,
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
