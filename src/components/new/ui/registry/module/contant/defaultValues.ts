import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
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
      objectExtra: {},
      total_count: 0,
      uniqKey: 'id',
      uniqKeyForParams: 'id',
      selectedRow: null,
      selectedRowToShow: null,
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
      is_render_field: false,
      selected_row_in_params: false,
      fields: [],
      fieldsInDeepArr: [],
      rowFields: [],
      row_fields_table_width: 0,
      treeFields: {},
      renderFieldsSchema: null,
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
    rendersFields: {
      errors: {},
      values: {},
      options: {},
    },
  },
};

export default registryDefaultObj;
