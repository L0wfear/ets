import { createPath } from 'redux-main/redux-utils';

const SESSION = createPath('SESSION');

export const SESSION_SET_DATA = SESSION`SET_DATA`;
export const SESSION_RESET_DATA = SESSION`RESET_DATA`;

export const SESSION_SET_CONFIG = SESSION`SET_CONFIG`;

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

export const CONFIG_INITIAL = { // дефолтное значение конфигурации
  enums: {
    FUEL_TYPE: {},
  },
  defaults: {
    FUEL_TYPE: 'DT',
  },
  shift: {
    shift_end: null, // todo: сделать вызов тех же методов что и в факсограмме
    shift_start: null, // todo: сделать вызов тех же методов что и в факсограмме
  },
  summer_start: [
    4,
    6,
  ],
  summer_end: [
    11,
    1,
  ],
  footer_url: '',
  project_name: '',
};

const initialState = {
  userData: {
    map_config: {
      zoom: MAP_INITIAL_ZOOM,
      coordinates: MAP_INITIAL_CENTER,
    },
    permissions: [],
  },
  token: null,
  appConfig: CONFIG_INITIAL,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SESSION_SET_DATA: {
      return {
        ...state,
        userData: {
          ...payload.userData,
          map_config: {
            ...initialState.userData.map_config,
            ...payload.userData.map_config,
          },
        },
        token: payload.token,
      };
    }
    case SESSION_SET_CONFIG: {
      return {
        ...state,
        appConfig: payload.appConfig || CONFIG_INITIAL,
      };
    }
    case SESSION_RESET_DATA: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
