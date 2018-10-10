const registryDefaultObj = {
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
    },
    meta: {
      fields: [],
      fieldsInDeepArr: [],
      rowFields: [],
      treeFields: {},
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
