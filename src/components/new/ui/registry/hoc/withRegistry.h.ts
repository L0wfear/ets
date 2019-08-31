import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export type ButtonDefineType = string[];

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

export type FilterOptionType<F> = {
  value: F[keyof F];
  label: string | number;
  [k: string]: any
};

export type OneFilterType<F> = {
  valueKey: keyof F;
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

export type TypeFields<F extends any> = {
  key: keyof F;
  title: string | DisplayIfTitle[];
  width?: number;
  dashIfEmpty?: boolean;
  sortable?: boolean;
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
};

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
      selected_row_in_params?: OneRegistryData<F>['list']['meta']['selected_row_in_params'];
      row_double_click?: OneRegistryData<F>['list']['meta']['row_double_click'];
      fields?: OneRegistryData<F>['list']['meta']['fields'];
    };
    paginator?: Partial<OneRegistryData<F>['list']['paginator']>;
  };
};
