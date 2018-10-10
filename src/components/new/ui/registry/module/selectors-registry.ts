const defaultHeader = {
  header: {
    title: '',
    buttons: [],
  },
};

const defaultFilter = {
  filter: {
    isOpen: false,
    rawFilterValues: {},
    fields: [],
  },
};

const defaultList = {
  list: {
    data: {
      uniqKey: 'id',
      array: [],
      total_count: 0,
    },
    paginator: {
      currentPage: 0,
      perPage: 15,
    },
    processed: {
      processedArray: [],
      total_count: 0,
      sort: {
        field: '',
        reverse: false,
      },
      filterValues: {},
    },
    meta: {
      fields: [],
      treeFields: {},
      rowFields: [],
      fieldsInDeepArr: [],
      noEnumerated: false,
    },
  },
};

const defaultRootRegistry = {};

export const getHeaderData = (registryState, registryKey) => (
  (registryState[registryKey] || defaultHeader).header
);

export const getListData = (registryState, registryKey) => (
  (registryState[registryKey] || defaultList).list
);

export const getFilterData = (registryState, registryKey) => (
  (registryState[registryKey] || defaultFilter).filter
);

export const getRootRegistry = (registryState, registryKey) => (
  (registryState[registryKey] || defaultRootRegistry)
);
