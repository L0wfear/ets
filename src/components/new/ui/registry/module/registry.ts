import { createPath } from 'redux-main/redux-utils';

const REGISTRY = createPath('REGISTRY');

export const REGISTRY_ADD_INITIAL_DATA = REGISTRY`ADD_INITIAL_DATA`;
export const REGISTRY_REMOVE_DATA = REGISTRY`REMOVE_DATA`;
export const REGISTRY_CHANGE_FILTER = REGISTRY`CHANGE_FILTER_DATA`;
export const REGISTRY_CHANGE_LIST = REGISTRY`CHANGE_LIST`;

export type InitialStateTypeRegistry = {
  [key: string]: {
    Service: any;
    header: {
      title: string;
    };
    list: {
      data: {
        array: any[];
      },
      sort: {
        field: string;
        reverse: boolean;
      },
      meta: {
        fields: any[],
      },
    };
    filter: {
      isOpen: boolean;
      meta: {
        fields: any[],
        treeFields: any;
        rowFields: any[];
        fieldsInDeepArr: any[];
      },
      rawFilterValues: {},
    };
  };
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
    default: {
      return state;
    }
  }
};
