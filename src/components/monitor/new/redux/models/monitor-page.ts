import { createPath } from 'redux/redux-utils';
import carInfoReducer from 'components/monitor/new/info/car-info/redux/modules/car-info';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { getDateWithMoscowTz } from 'utils/dates';

const MONITOR_PAGE = createPath('MONITOR_PAGE');

export const MONITOR_PAGE_SET_CAR_ACTUAL_INDEX = MONITOR_PAGE`SET_CAR_ACTUAL_INDEX`;
export const MONITOR_PAGE_SET_GEOMETRY = MONITOR_PAGE`SET_GEOMETRY`;

export const MONITOR_PAGE_CHANGE_CARS_BY_STATUS = MONITOR_PAGE`CHANGE_CARS_BY_STATUS`;
export const MONITOR_PAGE_TOGGLE_STATUS_SHOW = MONITOR_PAGE`TOGGLE_STATUS_SHOW`;
export const MONITOR_PAGE_TOGGLE_STATUS_GEO = MONITOR_PAGE`TOGGLE_STATUS_GEO`;
export const MONITOR_PAGE_TOGGLE_STATUS_GEOOBECT = MONITOR_PAGE`TOGGLE_STATUS_GEOOBECT`;
export const MONITOR_PAGE_TOGGLE_STATUS_SHOW_GOV_NUMBER = MONITOR_PAGE`TOGGLE_STATUS_SHOW_GOV_NUMBER`;

export const MONITOR_PAGE_ADD_TO_SELECTED_GEOMETRY = MONITOR_PAGE`ADD_TO_SELECTED_GEOMETRY`;
export const MONITOR_PAGE_REMOVE_FROM_SELECTED_GEOMETRY = MONITOR_PAGE`REMOVE_FROM_SELECTED_GEOMETRY`;
export const MONITOR_PAGE_REMOVE_ALL_FROM_SELECTED_GEOMETRY = MONITOR_PAGE`REMOVE_ALL_FROM_SELECTED_GEOMETRY`;

export const MONITOR_PAGE_RESER = MONITOR_PAGE`RESER`;
export const MONITOR_PAGE_RESER_CAR_STATUS = MONITOR_PAGE`RESER_CAR_STATUS`;
export const MONITOR_PAGE_CHANGE_FILTERS = MONITOR_PAGE`CHANGE_FILTERS`;
export const MONITOR_PAGE_MERGE_FILTERS_GPS_CODE_LIST = MONITOR_PAGE`MERGE_FILTERS_GPS_CODE_LIST`;
export const MONITOR_PAGE_TOGGLE_MEASURE_ACTIVE = MONITOR_PAGE`TOGGLE_MEASURE_ACTIVE`;

const initialState = {
  carActualGpsNumberIndex: {},
  carInfo: carInfoReducer(undefined, {}),
  SHOW_GOV_NUMBER: false,
  status: {
    in_move: true,
    stop: true,
    parking: true,
    not_in_touch: true,
  },
  statusGeo: {
    SHOW_TRACK: true,
    SHOW_GEOOBJECTS: true,
  },
  carsByStatus: {
    in_move: 0,
    stop: 0,
    parking: 0,
    not_in_touch: 0,
  },
  geoobjects: {
    ...Object.entries(GEOOBJECTS_OBJ).reduce((newObj, [key, { serverName }]) => ({
      ...newObj,
      [serverName]: {
        show: false,
        data: {},
      },
    }), {}),
  },
  selectedGeoobjects: {
    ...Object.entries(GEOOBJECTS_OBJ).reduce((newObj, [key, { serverName }]) => ({
      ...newObj,
      [serverName]: {
      },
    }), {}),
  },
  filters: {
    data: {
      carFilterText: '',
      carFilterMultyType: [],
      carFilterMultyStructure: [],
      carFilterMultyOwner: [],
    },
    filtredCarGpsCode: [],
  },
  measureActive: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case MONITOR_PAGE_SET_CAR_ACTUAL_INDEX: {
      return {
        ...state,
        carActualGpsNumberIndex: payload.carActualGpsNumberIndex,
      };
    }
    case MONITOR_PAGE_SET_GEOMETRY: {
      return {
        ...state,
        geoobjects: {
          ...state.geoobjects,
          ...Object.entries(payload).reduce((newObj, [key, data]) => ({
            ...newObj,
            [key]: {
              ...state.geoobjects[key],
              data,
            },
          }), {}),
        },
      };
    }
    case MONITOR_PAGE_CHANGE_CARS_BY_STATUS: {
      return {
        ...state,
        carsByStatus: {
          ...state.carsByStatus,
          ...Object.entries(payload.changedCarsByStatus).reduce((newObj, [key, value]) => ({
            ...newObj,
            [key]: state.carsByStatus[key] + value,
          }), {}),
        },
      };
    }
    case MONITOR_PAGE_TOGGLE_STATUS_SHOW: {
      return {
        ...state,
        status: {
          ...state.status,
          ...payload.typeArr.reduce((newObj, key) => ({
            ...newObj,
            [key]: !state.status[key],
          }), {}),
        }
      }
    }
    case MONITOR_PAGE_TOGGLE_STATUS_GEO: {
      return {
        ...state,
        statusGeo: {
          ...state.statusGeo,
          ...payload.typeArr.reduce((newObj, key) => ({
            ...newObj,
            [key]: !state.statusGeo[key],
          }), {}),
        }
      }
    }
    case MONITOR_PAGE_TOGGLE_STATUS_GEOOBECT: {
      return {
        ...state,
        geoobjects: {
          ...state.geoobjects,
          ...payload.typeArr.reduce((newObj, serverName) => ({
            ...newObj,
            [serverName]: {
              ...state.geoobjects[serverName],
              show: !state.geoobjects[serverName].show,
            },
          }), {}),
        },
      };
    }
    case MONITOR_PAGE_TOGGLE_STATUS_SHOW_GOV_NUMBER: {
      return {
        ...state,
        SHOW_GOV_NUMBER: !state.SHOW_GOV_NUMBER,
      };
    }
    case MONITOR_PAGE_RESER_CAR_STATUS: {
      return {
        ...state,
        status: {
          ...initialState.status,
        },
        carsByStatus: {
          ...initialState.carsByStatus,
        },
      };
    }
    case MONITOR_PAGE_RESER: {
      return {
        ...initialState,
      };
    }
    case MONITOR_PAGE_ADD_TO_SELECTED_GEOMETRY: {
      const {
        serverName,
        data: { ...data },
      } = payload;

      data.front_show = true;
      data.front_add_at = getDateWithMoscowTz();

      return {
        ...state,
        selectedGeoobjects: {
          ...state.selectedGeoobjects,
          [serverName]: {
            ...state.selectedGeoobjects[serverName],
            [payload.id]: {
              ...data,
            },
          },
        },
      };
    }
    case MONITOR_PAGE_REMOVE_FROM_SELECTED_GEOMETRY: {
      const { serverName, id } = payload;

      const { selectedGeoobjects: { ...selectedGeoobjects } } = state;
      const { [serverName]: { ...serverNameData } } = selectedGeoobjects;

      if (id) {
        serverNameData[payload.id].front_show = false;
        selectedGeoobjects[serverName] = serverNameData;
      } else {
        selectedGeoobjects[serverName] = Object.entries(selectedGeoobjects[serverName]).reduce((newObj, [id, data]) => ({
          ...newObj,
          [id]: {
            ...data,
            front_show: false,
          }
        }), {});
      }

      return {
        ...state,
        selectedGeoobjects,
      };
    }
    case MONITOR_PAGE_REMOVE_ALL_FROM_SELECTED_GEOMETRY: {
      return {
        ...state,
        selectedGeoobjects: Object.entries(state.selectedGeoobjects).reduce((newObj, [serverName, dataObj]) => ({
          ...newObj,
          [serverName]: Object.entries(dataObj).reduce((newObjByServerName, [id, data]) => ({
            ...newObjByServerName,
            [id]: {
              ...data,
              front_show: false,
            },
          }), {}),
        }), {}),
      };
    }
    case MONITOR_PAGE_CHANGE_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          data: {
            ...state.filters.data,
            [payload.type]: payload.value,
          },
        },
      };
    }
    case MONITOR_PAGE_MERGE_FILTERS_GPS_CODE_LIST: {
      return {
        ...state,
        filters: {
          ...state.filters,
          filtredCarGpsCode: {
            ...state.filters.filtredCarGpsCode,
            ...payload.filtredCarGpsCode,
          }
        },
      };
    }
    case MONITOR_PAGE_TOGGLE_MEASURE_ACTIVE: {
      return {
        ...state,
        measureActive: !state.measureActive,
      };
    }
    default: {
      return {
        ...state,
        carInfo: carInfoReducer(state.carInfo, { type, payload }),
      };
    }
  }
}