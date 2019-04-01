import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export type PropsRegistryWrap = {
  registryAddInitialData: any;
  registryRemoveData: any;
};

export type StateRegistryWrap = {

};

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
    type: 'advanced-number'
    | 'advanced-date'
    | 'advanced-string-like';
  }| {
    type: 'multiselect';
    labelKey?: string;
    options?: FilterOptionType<F>[];
    getRegistryData?: {
      entity?: string;
      typeAns?: 'result.rows' | 'result',
      valueKey?: string;
      labelKey?: string;
      mergeWithArray?: boolean;
      format?: (
        'dutyMissionTemplate'
        | 'employee'
      );
    }
  }
);

export type TypeFields<F extends any> = {
  key: keyof F;
  title: string | DisplayIfTitle[];
  width?: number;
  dashIfEmpty?: boolean;
  format?: (
    'date'
    | 'datetime'
    | 'datetimesecond'
    | 'boolean'
    | 'toFixed1'
    | 'toFixed2'
    | 'toFixed3'
    | 'array'
    | 'workOrNot'
  );
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  childrenFields?: TypeFields<F>[];
} | {
  key: 'enumerated';
  title: string;
  width?: number;
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
} | {
  key: 'checkbox';
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
};

export type TypeConfigData<F extends any> = {
  noInitialLoad?: boolean;
  Service: any;
  actionHelpers?: {
    get?: object;
    post?: object;
    put?: object;
    delete?: object;
    patch?: object;
  };
  registryKey: string;
  header: {
    title: string;
    buttons?: ButtonDefineType,
  },
  filter?: {
    isOpen?: boolean;
    fields: OneFilterType<F>[];
    rawFilterValues?: {
      [key in OneFilterType<F>['valueKey']]?: {
        in: {
          value: any[];
        };
      };
    };
  };
  list?: {
    data?: {
      fixedWidth?: boolean;
      uniqKey?: string;
      array?: F[];
      total_count?: number;
    },
    permissions: OneRegistryData['list']['permissions'];
    processed?: {
      processedArray?: F[];
      sort?: {
        field?: keyof F;
        reverse?: boolean
      };
      filterValues?: object;
      total_count?: number;
    },
    paginator?: {
      currentPage?: number,
      perPage?: number,
    },
    meta: {
      fields: TypeFields<F>[];
    },
  };
  trash?: object;
};
