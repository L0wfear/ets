import { createPath } from 'redux-main/redux-utils';
import { TypeOneDisplayIf, OneFilterType } from 'components/new/ui/registry/hoc/withRegistry.h';

const REGISTRY = createPath('REGISTRY');

export const REGISTRY_ADD_INITIAL_DATA = REGISTRY`ADD_INITIAL_DATA`;
export const REGISTRY_REMOVE_DATA = REGISTRY`REMOVE_DATA`;
export const REGISTRY_CHANGE_FILTER = REGISTRY`CHANGE_FILTER_DATA`;
export const REGISTRY_CHANGE_LIST = REGISTRY`CHANGE_LIST`;
export const REGISTRY_CHANGE_SERVICE = REGISTRY`CHANGE_SERVICE`;
export const REGISTRY_SET_LOADING_STATUS = REGISTRY`SET_LOADING_STATUS`;

export interface OneRegistryData {
  isLoading: boolean;
  Service: any;
  header?: {
    title?: any;
    titlePopover?: string;
    format?: (
      'default'
      | 'select_odh/dt(disabled)'
      | 'select_odh/dt'
      | 'datetime_range_picker'
      | 'select_for_technical_operation_relations'
    );
    buttons?: string[];
  };
  list: {
    data: {
      array: any[];
      arrayExtra: any; // use lodash.get
      total_count?: number;
      uniqKey?: string;
      uniqKeyForParams?: string;
      selectedRow?: object | null;
      selectedRowToShow?: object | null;
      checkedRows?: object | null;
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
      fields: any[],
      fieldsInDeepArr: any[],
      rowFields: any[],
      treeFields: object,
    },
    paginator?: {
      currentPage?: number;
      perPage?: number;
    },
    processed?: {
      filterValues?: object,
      processedArray?: any[],
      sort?: {
        field?: string,
        reverse?: boolean,
      },
      total_count?: number,
    },
  };
  filter: {
    isOpen?: boolean;
    fields: OneFilterType<any>[],
    rawFilterValues?: {},
    displayIf?: TypeOneDisplayIf | TypeOneDisplayIf[];
  };
}

export type InitialStateTypeRegistry = {
  [key: string]: OneRegistryData;
};

const initialState: InitialStateTypeRegistry = {
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case REGISTRY_ADD_INITIAL_DATA: {
      return {
        ...state,
        [payload.registryKey]: {
          ...payload.config,
        },
      };
    }
    case REGISTRY_REMOVE_DATA: {
      return {
        ...state,
        [payload.registryKey]: undefined,
      };
    }
    case REGISTRY_CHANGE_FILTER: {
      const { registryKey } = payload;

      return {
        ...state,
        [registryKey]: {
          ...state[registryKey],
          filter: payload.filter,
        },
      };
    }
    case REGISTRY_CHANGE_LIST: {
      const { registryKey } = payload;

      return {
        ...state,
        [registryKey]: {
          ...state[registryKey],
          list: payload.list,
        },
      };
    }
    case REGISTRY_CHANGE_SERVICE: {
      const { registryKey } = payload;

      return {
        ...state,
        [registryKey]: {
          ...state[registryKey],
          Service: payload.Service,
        },
      };
    }
    case REGISTRY_SET_LOADING_STATUS: {
      const { registryKey } = payload;

      return {
        ...state,
        [registryKey]: {
          ...state[registryKey],
          isLoading: payload.isLoading,
        },
      };
    }
    default: {
      return state;
    }
  }
};
