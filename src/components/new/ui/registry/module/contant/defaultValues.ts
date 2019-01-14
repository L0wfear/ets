import { OneRegistryData } from 'components/new/ui/registry/module/registry';

const registryDefaultObj: OneRegistryData = {
  Service: null,
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
      noEnumerated: false,
    },
    paginator: {
      currentPage: 0,
      perPage: 15,
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
