import { ButtonTypes } from 'components/new/ui/registry/contants/buttonsTypes';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export type PropsRegistryWrap = {
  registryAddInitialData: any;
  registryRemoveData: any;
};

export type StateRegistryWrap = {

};

export type ButtonDefineType = {
  type: ButtonTypes;
} | string;

export type TypeOneDisplayIf = 'isKgh' | 'isOkrug' | 'lenghtOptionMoreOne' | false;

export type DisplayIfTitle = {
  displayIf: TypeOneDisplayIf | TypeOneDisplayIf[];
  title: string;
};

export type OneFilterType = {
  valueKey: string;
  labelKey?: string;
  title: string | DisplayIfTitle[];
  type: 'multiselect'
    | 'advanced-number';
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  options?: {
    value: any;
    label: string | number;
    [k: string]: any;
  }[];
};

export type TypeFields = {
  key: string;
  title: string | DisplayIfTitle[];
  width?: number;
  boolean?: boolean;
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  toFixed?: number;
  childrenFields?: TypeFields[];
};

export type TypeConfigData = {
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
    buttons?: ButtonDefineType[],
  },
  filter?: {
    isOpen?: boolean;
    fields: OneFilterType[];
    rawFilterValues?: {
      [key in OneFilterType['valueKey']]?: {
        in: {
          value: any[];
        };
      };
    };
  };
  list?: {
    data?: {
      uniqKey?: string;
      array?: any[];
      total_count?: number;
    },
    permissions: OneRegistryData['list']['permissions'];
    processed?: {
      processedArray?: any[];
      sort?: {
        field?: string;
        reverse?: boolean
      };
      filterValues: object;
      total_count?: number;
    },
    paginator?: {
      currentPage?: number,
      perPage?: number,
    },
    meta: {
      fields: TypeFields[];
    },
  };
  trash?: object;
};
