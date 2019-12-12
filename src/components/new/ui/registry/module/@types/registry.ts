import { glyphMap } from 'global-styled';

export type FilterOptionType<F> = {
  value: F[keyof F];
  label: string | number;
  [k: string]: any
};

export type TypeFields<F extends any> = {
  hidden?: boolean;
} & (
  {
    key: keyof F;
    title: string | DisplayIfTitle[];
    width?: number;
    dashIfEmpty?: boolean;
    sortable?: boolean;
    hidden?: boolean;
    format?: (
      'date'
      | 'datetime'
      | 'datetimesecond'
      | 'boolean'
      | 'toFixed1'
      | 'toFixed2'
      | 'toFixed3'
      | 'array'
      | 'array_of_object_name'
      | 'link'
      | 'workOrNot'
      | 'yesOrNot'
      | 'floor'
      | 'road_accident_driver_fio'
      | 'AUTOBASE_REPAIR_STATUS'
      | 'TIME_MEASURES'
      | 'checkOrExpect'
      | 'efficiencySource'
      | 'company_structure_actions'
      | 'waybill_all_missions_status'
      | 'waybill_status_name'
    );
    displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
    displayIfPermission?: string | string[];
  } | {
    title: string;
    childrenFields?: TypeFields<F>[];
  } | {
    key: 'enumerated';
    title: string;
    width?: number;
    displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  } | {
    key: 'checkbox';
    title?: string,
    displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  } | {
    key: 'showMissionInfo';
    title: string;
  } | {
    key: 'is_open';
    title?: string;
  } | {
    key: 'company_structure_actions',
    title: string;
  } | {
    key: 'services_actions_on_off',
    title: string,
    sortable?: boolean;
    width: number;
  } | {
    key: 'service_files';
    title: string,
    sortable?: boolean;
    width: number;
  } | {
    key: 'button_show_action_log';
    title: string,
    sortable?: boolean;
    width: number;
  } | {
    key: 'buttonCloneTire',
    title: string;
  } | {
    key: 'edc_request_info',
    title: string,
    sortable?: boolean;
    width: number;
    displayIfPermission?: string | string[];
  } | {
    key: 'show_file_list',
    title: string;
  } | {
    key: 'show_edc_comments',
    title: string;
    displayIfPermission?: string | string[];
  }
);

export type TypeOneDisplayIf = (
  'isKgh'
  | 'isOkrug'
  | 'lenghtStructureMoreOne'
  | false
);

export type DisplayIfTitle = {
  displayIf: TypeOneDisplayIf | TypeOneDisplayIf[];
  title: string;
};

export type OneFilterType<F> = {
  valueKey: Extract<keyof F, string>;
  title: string | DisplayIfTitle[];
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  options?: FilterOptionType<F>[];
  disabled?: boolean;
} & (
  {
    type: 'advanced-date'
    | 'advanced-datetime'
    | 'advanced-string-like';
  } | {
    type: 'advanced-number';
    step: number; // для firefox
  } | {
    type: 'multiselect';
    labelKey?: keyof F;
    options?: FilterOptionType<F>[];
    getRegistryData?: {
      entity: string;
      groupName?: string;                           // для группировки запросов
      payload?: object;
      typeAns?: 'result.rows' | 'result',
      valueKey: string;
      labelKey?: string;
      mergeWithArray?: boolean;
      format?: (
        'short_employee_name'
        | 'work_mode_label'
      );
    }
  } | {
    type: 'advanced-select-like',
    options: any[];
  }
);

export interface OneRegistryData<F = any> {
  idRequestTime: number;
  isLoading: boolean;
  Service: any;
  header: {
    title?: any;
    titlePopover: string;
    format: (
      'default'
      | 'select_odh/dt(disabled)'
      | 'select_odh/dt'
      | 'datetime_range_picker'
      | 'select_for_technical_operation_relations'
    );
    buttons: Array<{
      type: string;
      title?: string;
      glyph?: keyof typeof glyphMap;                                        // EtsBootstrap.Glyphicon glyph
      format?: string;
      objChangeParams?: object;                                             // что заменять в params при клике
      message_single?: string;
      message_multi?: string;
    }>;
  };
  list: {
    data: {
      array: F[];
      arrayExtra: any; // use lodash.get
      total_count: number;
      uniqKey: keyof F;
      uniqKeyForParams?: string;
      selectedRow: F;
      selectedRowToShow: F;
      checkedRows: Record<keyof F, F>;
      fixedWidth: boolean;
      proxyCheckData?: (
        'mission_template'
      )
    },
    permissions: {
      list: string | boolean;
      create: string | boolean;
      read: string | boolean;
      update: string | boolean;
      delete: string | boolean;
      [otherKey: string]: string | boolean;
    };
    meta: {
      row_double_click: boolean;
      fields: TypeFields<F>[];
      fieldsInDeepArr: any[],
      rowFields: any[],
      treeFields: object,
    },
    paginator?: {
      currentPage?: number;
      perPage?: number;
    },
    processed?: {
      filterValues?: {
        [k: string]: any;
      },
      processedArray?: F[],
      sort?: {
        field?: keyof F;
        reverse?: boolean,
      },
      total_count?: number,
    },
  };
  filter: {
    isOpen?: boolean;
    fields: OneFilterType<F>[],
    rawFilterValues?: {
      [key in OneFilterType<F>['valueKey']]?: {
        in: {
          value: any[];
        };
      };
    },
    displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  };
}

export type TypeConfigData<F> = {
  noInitialLoad?: boolean;
  Service: OneRegistryData<F>['Service'];
  registryKey: string;
  header?: {
    title?: OneRegistryData<F>['header']['title'];
    titlePopover?: OneRegistryData<F>['header']['titlePopover'];
    format?: OneRegistryData<F>['header']['format'];
    buttons?: Array<ValuesOf<OneRegistryData<F>['header']['buttons']> | string>,
  };
  filter?: Partial<OneRegistryData<F>['filter']>;
  list?: {
    data?: Partial<OneRegistryData<F>['list']['data']>;
    permissions?: Partial<OneRegistryData<F>['list']['permissions']>;
    processed?: {
      processedArray?: OneRegistryData<F>['list']['processed']['processedArray'];
      sort?: Partial<OneRegistryData<F>['list']['processed']['sort']>;
      filterValues?: OneRegistryData<F>['list']['processed']['filterValues'];
      total_count?: OneRegistryData<F>['list']['processed']['total_count'];
    };
    meta: {
      row_double_click?: OneRegistryData<F>['list']['meta']['row_double_click'];
      fields?: OneRegistryData<F>['list']['meta']['fields'];
    };
    paginator?: Partial<OneRegistryData<F>['list']['paginator']>;
  };
};

export type InitialStateTypeRegistry = {
  [key: string]: OneRegistryData;
};
