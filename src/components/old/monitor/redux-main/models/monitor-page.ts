import { createPath } from 'redux-main/redux-utils';
import carInfoReducer, { IStateCarInfo, initialState as carInfoInitialState } from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { getToday0am, getDateWithMoscowTz } from 'components/@next/@utils/dates/dates';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const MONITOR_PAGE = createPath('MONITOR_PAGE');

export const MONITOR_PAGE_SET_CAR_ACTUAL_INDEX = MONITOR_PAGE`SET_CAR_ACTUAL_INDEX`;
export const MONITOR_PAGE_SET_GEOMETRY = MONITOR_PAGE`SET_GEOMETRY`;
export const MONITOR_PAGE_SET_COMPANY = MONITOR_PAGE`PAGE_SET_COMPANY`;

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
export const MONITOR_PAGE_TOGGLE_DRAW_ACTIVE = MONITOR_PAGE`TOGGLE_DRAW_ACTIVE`;
export const MONITOR_PAGE_FALSE_DRAW_ACTIVE = MONITOR_PAGE`FALSE_DRAW_ACTIVE`;

export const MONITOR_PAGE_CHANGE_FUEL_EVENTS_DATE = MONITOR_PAGE`CHANGE_FUEL_EVENTS_DATE`;
export const MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_DATA = MONITOR_PAGE`CHANGE_FUEL_EVENTS_LEAK_DATA`;
export const MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_OVERLAY_DATA = MONITOR_PAGE`CHANGE_FUEL_EVENTS_LEAK_OVERLAY_DATA`;
export const MONITOR_PAGE_TOGGLE_FUEL_EVENTS_LEAK_SHOW = MONITOR_PAGE`TOGGLE_FUEL_EVENTS_LEAK_SHOW`;

export type IStateMonitorPage = {
  carActualGpsNumberIndex: Record<Car['gps_code'], Car>;
  carActualGpsCount: number;
  carActualList: Array<Car>;
  carActualNotInMap: Array<Car>;
  carInfo: IStateCarInfo;
  carsByStatus: {
    in_move: number;
    stop: number;
    parking: number;
    not_in_touch: number;
    not_in_map: number; // считается на фронте
  };
  SHOW_GOV_NUMBER: boolean;
  status: {
    in_move: boolean;
    stop: boolean;
    parking: boolean;
    not_in_touch: boolean;
  };
  statusGeo: {
    SHOW_TRACK: boolean;
    SHOW_GEOOBJECTS: boolean;
  };
  geoobjects: {
    [k in typeof GEOOBJECTS_OBJ[keyof typeof GEOOBJECTS_OBJ]['serverName']]: {
      show: boolean;
      data: object;
    }
  };
  selectedGeoobjects: {
    [k in typeof GEOOBJECTS_OBJ[keyof typeof GEOOBJECTS_OBJ]['serverName']]: object;
  };
  filters: {
    data: {
      carFilterText: string;
      carFilterMultyType: Array<number>;
      carFilterMultyStructure: Array<number>;
      carFilterMultyOwner: Array<number>;
      featureBufferPolygon: null | { type: 'Poligon'; coordinates: Array<any>;}; // DITETSSUP-2007
    };
    filtredCarGpsCode: Array<number>;
  };
  companiesIndex: -1 | object;
  drawActive: {
    all: boolean;
    measureActive: boolean;
    polygonBuffer: boolean;
  };
  fuelEvents: {
    leak: {
      show: boolean;
      overlayData: any;
      data: object;
      date_from: any;
      date_to: any;
    };
  };
};

export const initialMonitorState: IStateMonitorPage = {
  carActualGpsNumberIndex: {},
  carActualGpsCount: 0,
  carActualList: [],
  carActualNotInMap: [],
  carInfo: carInfoReducer(carInfoInitialState, {}),
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
    not_in_map: 0,
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
      featureBufferPolygon: null, // DITETSSUP-2007
    },
    filtredCarGpsCode: [],
  },
  companiesIndex: -1,
  drawActive: {
    all: false,
    measureActive: false,
    polygonBuffer: false,
  },
  fuelEvents: {
    leak: {
      show: false,
      overlayData: null,
      data: {},
      date_from: getToday0am(),
      date_to: getDateWithMoscowTz(),
    },
  },
};

export default (state = initialMonitorState, { type, payload }) => {
  switch (type) {
    case MONITOR_PAGE_SET_CAR_ACTUAL_INDEX: {
      return {
        ...state,
        carActualGpsNumberIndex: payload.carActualGpsNumberIndex,
        carActualGpsCount: payload.carActualGpsCount,
        carActualList: payload.carActualList,
      };
    }
    case MONITOR_PAGE_SET_COMPANY: {
      return {
        ...state,
        companiesIndex: payload.companiesIndex,
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
        carsByStatus: payload.carsByStatus,
        carActualNotInMap: payload.carActualNotInMap,
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
        },
      };
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
        },
      };
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
          ...initialMonitorState.status,
        },
        carsByStatus: {
          ...initialMonitorState.carsByStatus,
        },
      };
    }
    case MONITOR_PAGE_RESER: {
      return {
        ...initialMonitorState,
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
      const { [serverName]: { ...serverNameData } } = selectedGeoobjects as any;

      if (id) {
        serverNameData[payload.id].front_show = false;
        selectedGeoobjects[serverName] = serverNameData;
      } else {
        selectedGeoobjects[serverName] = Object.entries(selectedGeoobjects[serverName]).reduce((newObj, [key, data]) => ({
          ...newObj,
          [key]: {
            ...data,
            front_show: false,
          },
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
          },
        },
      };
    }
    case MONITOR_PAGE_TOGGLE_DRAW_ACTIVE: {
      const { drawKey } = payload;
      const {
        drawActive: {
          all,
          ...drawActive
        },
      } = state;

      drawActive[drawKey] = !state.drawActive[drawKey];

      return {
        ...state,
        drawActive: {
          ...drawActive,
          all: Object.values(drawActive).some((flag) => Boolean(flag)),
        },
      };
    }
    case MONITOR_PAGE_FALSE_DRAW_ACTIVE: {
      const { drawKey } = payload;
      const {
        drawActive: {
          all,
          ...drawActive
        },
      } = state;

      drawActive[drawKey] = false;

      return {
        ...state,
        drawActive: {
          ...drawActive,
          all: Object.values(drawActive).some((flag) => Boolean(flag)),
        },
      };
    }
    case MONITOR_PAGE_CHANGE_FUEL_EVENTS_DATE: {
      return {
        ...state,
        fuelEvents: {
          ...state.fuelEvents,
          [payload.type]: {
            ...state.fuelEvents[payload.type],
            [payload.field]: payload.date,
          },
        },
      };
    }
    case MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_DATA: {
      return {
        ...state,
        fuelEvents: {
          ...state.fuelEvents,
          leak: {
            ...state.fuelEvents.leak,
            data: payload.leak,
          },
        },
      };
    }
    case MONITOR_PAGE_CHANGE_FUEL_EVENTS_LEAK_OVERLAY_DATA: {
      return {
        ...state,
        fuelEvents: {
          ...state.fuelEvents,
          leak: {
            ...state.fuelEvents.leak,
            overlayData: payload.overlayData,
          },
        },
      };
    }
    case MONITOR_PAGE_TOGGLE_FUEL_EVENTS_LEAK_SHOW: {
      const show = ! state.fuelEvents.leak.show;

      return {
        ...state,
        fuelEvents: {
          ...state.fuelEvents,
          leak: {
            ...state.fuelEvents.leak,
            show,
            data: show ? state.fuelEvents.leak.data : {},
          },
        },
      };
    }
    default: {
      return {
        ...state,
        carInfo: carInfoReducer(state.carInfo, { type, payload }),
      };
    }
  }
};
