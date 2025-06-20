import { createPath } from 'redux-main/redux-utils';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

const SESSION = createPath('SESSION');

export const SESSION_SET_DATA = SESSION`SET_DATA`;
export const SESSION_RESET_DATA = SESSION`RESET_DATA`;

export const SESSION_SET_CONFIG = SESSION`SET_CONFIG`;
export const SESSION_SET_TRACK_CONFIG = SESSION`SET_TRACK_CONFIG`;

const MAP_INITIAL_CENTER: InitialStateSession['userData']['map_config']['coordinates'] = [
  -399.43090337943863,
  -8521.192605428025,
];
const MAP_INITIAL_ZOOM = 3;

export const CONFIG_INITIAL: InitialStateSession['appConfig'] = {
  current_season: 'summer',

  env: 'dev',
  map_track_days: 10,                                                   // максимальный интервал загрузки трека
  // дефолтное значение конфигурации
  api_versions: [],
  category_license: {
    category_drivers_license: [],
    category_special_license: [],
  },
  points_ws: 'wss://ets.mos.ru/services/stream',
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
  summer_start_date: '',
  summer_end_date: '',
  footer_url: '',
  project_name: '',
  can_switch_api_version: false,
};

export const TRACK_CONFIG_INITIAL = {
  api_version_stable: 4,
  api_versions: [],
};

const initialState: InitialStateSession = {
  userData: {
    map_config: {
      zoom: MAP_INITIAL_ZOOM,
      coordinates: MAP_INITIAL_CENTER,
    },
    permissions: [],
    structure_id: null,
    structure_name: null,
    structures: [],
    company_id: null,
    isOkrug: false,
    isKgh: false,
    isGlavControl: false,
    permissionsSet: new Set(),
    companies: [],
    company_name: '',
    fio: null,
    default_path: null,
    first_name: null,
    last_name: null,
    login: null,
    middle_name: null,
    okrugs: [],
    okrug_id: null,
    okrug_name: '',
    role: null,
    stableRedirect: null,
    user_id: null,
  },
  token: null,
  appConfig: CONFIG_INITIAL,
  appConfigTracksCaching: TRACK_CONFIG_INITIAL,
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
        appConfig: {
          ...payload.appConfig,
        },
      };
    }
    case SESSION_SET_TRACK_CONFIG: {
      return {
        ...state,
        appConfigTracksCaching: {
          ...payload.appConfigTracksCaching,
        },
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
