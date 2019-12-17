import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { DEFAULT_ITEMS_PER_PAGE } from 'constants/ui';

const registryDefaultObj: OneRegistryData<any> = {
  idRequestTime: 1,
  isLoading: false,
  Service: {
    getRegistryData: {
      entity: '',
      payload: {},
    },
  },
  path: null,
  filter: {
    fields: [],
    isOpen: false,
    rawFilterValues: {},
  },
  header: {
    buttons: [],
    format: 'default',
    title: '',
    titlePopover: '',
  },
  list: {
    data: {
      array: [],
      objectExtra: {},
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
      rowRequestActions: {
        actionUpdate: null,
        actionCreate: null,
      },
      is_render_field: false,
      selected_row_in_params: false,
      fields: [],
      fieldsInDeepArr: [],
      rowFields: [],
      row_fields_table_width: 0,
      treeFields: {},
      renderFieldsSchema: null,
      groupColumn: {},
    },
    paginator: {
      currentPage: 0,
      perPage: DEFAULT_ITEMS_PER_PAGE,
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
    rendersFields: {
      errors: {},
      values: {},
      options: {},
    },
  },
};

export default registryDefaultObj;
