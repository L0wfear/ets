import { createPath } from 'redux-main/redux-utils';
import { InitialStateTypeRegistry } from 'components/new/ui/registry/module/@types/registry';

const REGISTRY = createPath('REGISTRY');

export const REGISTRY_ADD_INITIAL_DATA = REGISTRY`ADD_INITIAL_DATA`;
export const REGISTRY_REMOVE_DATA = REGISTRY`REMOVE_DATA`;
export const REGISTRY_CHANGE_FILTER = REGISTRY`CHANGE_FILTER_DATA`;
export const REGISTRY_CHANGE_LIST = REGISTRY`CHANGE_LIST`;
export const REGISTRY_CHANGE_SERVICE = REGISTRY`CHANGE_SERVICE`;
export const REGISTRY_SET_LOADING_STATUS = REGISTRY`SET_LOADING_STATUS`;
export const REGISTRY_SET_ID_REQUEST_TIME = REGISTRY`SET_ID_REQUEST_TIME`;

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
      const state_new = { ...state };
      delete state_new[payload.registryKey];

      return state_new;
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
    case REGISTRY_SET_ID_REQUEST_TIME: {
      const { registryKey } = payload;

      return {
        ...state,
        [registryKey]: {
          ...state[registryKey],
          idRequestTime: payload.idRequestTime,
        },
      };
    }
    default: {
      return state;
    }
  }
};
