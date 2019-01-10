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

export type OneFilterType = {
  valueKey: string;
  labelKey?: string;
  title: string;
  type: 'multiselect'
    | 'advanced-number';
  displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
};

export type TypeFields = {
  key: string;
  title: any;
  width?: number;
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
