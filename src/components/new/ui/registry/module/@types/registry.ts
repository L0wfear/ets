import { glyphMap } from 'global-styled';
import { TypeOneDisplayIf } from 'components/new/ui/registry/contants/displayIf';

export type FilterOptionType<F> = {
  value: F[keyof F];
  label: string | number;
  [k: string]: any
};

export type TypeFieldsRegistry<F extends Record<string, any>> = (
  TypeFields<F, string> & {
    title?: string;
  }
);
export type CommonTypeField<F extends Record<string, any>, Title = string | DisplayIfTitle[]> = {
  hidden?: boolean;
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  displayIfPermission?: string | string[];
  sortable?: boolean;
  width?: number;
  dashIfEmpty?: boolean;
  title?: Title;
};

export type TypeFieldsAvalibaleKey<F> = (
  Extract<keyof F, string>
  | 'checkbox'
  | 'enumerated'
  | 'showMissionInfo'
  | 'is_open'
  | 'company_structure_actions'
  | 'services_actions_on_off'
  | 'service_files'
  | 'button_show_action_log'
  | 'buttonCloneTire'
  | 'edc_request_info'
  | 'show_file_list'
  | 'show_edc_comments'
);

export type TypeFieldsWithoutDeep<F extends Record<string, any>, Title = string | DisplayIfTitle[]> = (
  CommonTypeField<F, Title>
 ) & (
  {
    key: Extract<keyof F, string>;
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
      | 'road_accident_driver_fio'
      | 'AUTOBASE_REPAIR_STATUS'
      | 'TIME_MEASURES'
      | 'checkOrExpect'
      | 'efficiencySource'
      | 'floor'
      | 'company_structure_actions'
      | 'waybill_all_missions_status'
      | 'waybill_status_name'
    );
  } | {
    key: TypeFieldsAvalibaleKey<void>;
  }
);

export type TypeFields<F extends Record<string, any>, Title = string | DisplayIfTitle[]> = (
  TypeFieldsWithoutDeep<F, Title>
  | CommonTypeField<F, Title> & {
    childrenFields?: TypeFields<F, Title>[];
  }
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
    labelKey?: Extract<keyof F, string>;
    options?: FilterOptionType<F>[];
    getRegistryData?: {
      entity: string;
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
      | 'is_current_structure'
      | 'order_to'
    );
    is_current_structure_popover?: string;
    buttons: Array<{
      type: string;
      id: string;
      title?: string;
      glyph?: keyof typeof glyphMap;                                        // EtsBootstrap.Glyphicon glyph
      format?: string;
      objChangeParams?: object;                                             // что заменять в params при клике
    }>;
  };
  list: {
    data: {
      array: F[];
      objectExtra: Record<string, any> // use lodash.get
      total_count: number;
      uniqKey: Extract<keyof F, string>;
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
      selected_row_in_params: boolean;
      fields: Array<TypeFieldsRegistry<F>>;
      fieldsInDeepArr: Array<Array<TypeFieldsWithoutDeep<F>>>,
      rowFields: any[],
      row_fields_table_width: number;
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
        field?: Extract<keyof F, string>;
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
    is_current_structure_popover?: OneRegistryData<F>['header']['is_current_structure_popover'];
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
