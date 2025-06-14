import { createPath } from 'redux-main/redux-utils';
import { getStartOfToday } from 'components/@next/@utils/dates/dates';
import { initialMaxSpeed } from 'components/old/monitor/info/car-info/redux-main/modules/constatnts';
import { isArray } from 'util';

const CAR_INFO = createPath('CAR_INFO');

export const CAR_INFO_SET_GPS_CODE = CAR_INFO`SET_SELECTED_GPS_CODE`;
export const CAR_INFO_SET_STATUS = CAR_INFO`SET_STATUS`;
export const CAR_INFO_SET_TRACK_CACHING = CAR_INFO`SET_TRACK_CACHING`;
export const CAR_INFO_SET_MISSIONS_AND_WAYBILLS_DATA = CAR_INFO`SET_MISSIONS_AND_WAYBILLS_DATA`;
export const CAR_INFO_RESET_MISSIONS_AND_WAYBILLS_DATA = CAR_INFO`RESET_MISSIONS_AND_WAYBILLS_DATA`;
export const CAR_INFO_PUSH_POINT_INTO_TRACK = CAR_INFO`PUSH_POINT_INTO_TRACK`;
export const CAR_INFO_TOGGLE_FOR_TODAY = CAR_INFO`TOGGLE_FOR_TODAY`;
export const CAR_INFO_CHANGE_DATE_AND_FOR_TODAY = CAR_INFO`CHANGE_DATE_AND_FOR_TODAY`;
export const CAR_INFO_RESET_TRACK_CACHING = CAR_INFO`RESET_TRACK_CACHING`;
export const CAR_INFO_CHANGE_DATE = CAR_INFO`CHANGE_DATE`;
export const CAR_INFO_TOGGLE_PLAY = CAR_INFO`TOGGLE_PLAY`;
export const CAR_INFO_STOP_PLAY = CAR_INFO`STOP_PLAY`;
export const CAR_INFO_INC_TRACK_POINT_INDEX = CAR_INFO`INC_TRACK_POINT_INDEX`;

export const CAR_INFO_TOGGLE_SENSOR_SHOW = CAR_INFO`TOGGLE_SENSOR_SHOW`;
export const CAR_INFO_TOGGLE_STATUS_TC_FOLLOW_ON_CAR = CAR_INFO`STATUS_TC_FOLLOW_ON_CAR`;

export const CAR_INFO_SET_POPUP_TRACK_POINT = CAR_INFO`SET_POPUP_TRACK_POINT`;
export const CAR_INFO_SET_POPUP_PARKING_POINT = CAR_INFO`SET_POPUP_PARKING_POINT`;
export const CAR_INFO_SET_POPUP_FUEL_EVENT_POINT = CAR_INFO`SET_POPUP_FUEL_EVENT_POINT`;

export type IStateCarInfo = {
  gps_code: string;
  gov_number: string;
  missionsAndWaybillsData: {
    error: boolean;
    missions: -1 | Array<any>;
    mkad_speed_lim: number;
    speed_lim: number;
    waybills: -1 | Array<any>;
    carTabInfo: {
      contractor_name: string;
      customer_name: string;
      owner_name: string;
    };
    isLoading: boolean;
  };
  trackCaching: {
    error: boolean;
    cars_sensors: Record<string, {
      type_slug: string;
      type_name?: string;
    }>;
    front_cars_sensors_level: Record<string, {
      sensor: IStateCarInfo['trackCaching']['cars_sensors'];
      data: Array<any>;
      show: boolean;
      color: string;
      connectNulls: number;
      name: string;
    }>;
    front_cars_sensors_equipment: Record<string, {
      sensor: IStateCarInfo['trackCaching']['cars_sensors'];
      data: Array<any>;
      type_name: string;
      color: string;
      connectNulls: number;
      name: string;
      show: boolean;
    }>;
    consumptions: object;
    distance: -1 | number;
    duration_moving: -1 | number;
    equipment: object;
    front_events_list: Array<{
      date: string;
      type_name: string;
      value: number;
    }>;
    equipment_distance: -1 | number;
    equipment_time: -1 | number;
    events: object;
    parkings: -1 | number;
    front_parkings: -1 | number;
    sensors: object;
    sensors_data: {
      cars_sensors: object;
      consumptions: object;
      sensors_track: object;
    };
    time_of_parking: -1 | number;
    track: -1 | Array<{
      timestamp: number;
    }>;
    isCorssingMKAD: boolean;
  };
  status: number;
  forToday: boolean;
  date_start: string | Date;
  date_end: string | Date;
  playTrack: {
    status: 'stop' | 'payse' | 'play' | string;
    trackPointIndex: number;
  };
  statusTC: {
    FOLLOW_ON_CAR: boolean;
  };
  popups: {
    trackPoint: any;
    fuelEventPoint: any;
    parkingPoint: any;
  };
};

export const getTrackDefaultDateStart = () => getStartOfToday();
export const getTrackDefaultDateEnd = () => new Date();

export const initialState: IStateCarInfo = {
  gps_code: null,
  gov_number: null,
  missionsAndWaybillsData: {
    error: false,
    missions: -1,
    mkad_speed_lim: initialMaxSpeed,
    speed_lim: initialMaxSpeed,
    waybills: -1,
    carTabInfo: {
      contractor_name: null,
      customer_name: null,
      owner_name: null,
    },
    isLoading: true,
  },
  trackCaching: {
    error: false,
    cars_sensors: {},
    front_cars_sensors_level: {},
    front_cars_sensors_equipment: {},
    consumptions: {},
    distance: -1,
    duration_moving: -1,
    equipment: {},
    front_events_list: [],
    equipment_distance: -1,
    equipment_time: -1,
    events: {},
    parkings: -1,
    front_parkings: -1,
    sensors: {},
    sensors_data: {
      cars_sensors: {},
      consumptions: {},
      sensors_track: {},
    },
    time_of_parking: -1,
    track: -1,
    isCorssingMKAD: false,
  },
  status: 0,
  forToday: true,
  date_start: getTrackDefaultDateStart(),
  date_end: getTrackDefaultDateEnd(),
  playTrack: {
    status: 'stop',
    trackPointIndex: 0,
  },
  statusTC: {
    FOLLOW_ON_CAR: false,
  },
  popups: {
    trackPoint: null,
    fuelEventPoint: null,
    parkingPoint: null,
  },
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case CAR_INFO_SET_GPS_CODE: {
      const newState = {
        ...initialState,
        gps_code: payload.gps_code,
        gov_number: payload.gov_number,
        date_start: state.gps_code === payload.gps_code ? state.date_start : getTrackDefaultDateStart(),
        date_end: state.gps_code === payload.gps_code ? state.date_end : getTrackDefaultDateEnd(),
        forToday: state.gps_code === payload.gps_code ? state.forToday : initialState.forToday,
        status: state.status
          ? state.status
          : initialState.status,
      };

      return newState;
    }
    case CAR_INFO_SET_STATUS: {
      return {
        ...state,
        status: payload.status,
      };
    }
    case CAR_INFO_SET_TRACK_CACHING: {
      let newState = state;

      if (state.gps_code === payload.gps_code) {
        newState = {
          ...state,
          trackCaching: {
            ...payload.trackCaching,
          },
        };
      }
      return newState;
    }
    case CAR_INFO_SET_MISSIONS_AND_WAYBILLS_DATA: {
      let newState = state;
      if (state.gps_code === payload.gps_code) {
        newState = {
          ...state,
          missionsAndWaybillsData: {
            error: Boolean(payload.error),
            missions: payload.missions,
            mkad_speed_lim: payload.mkad_speed_lim,
            speed_lim: payload.speed_lim,
            waybills: payload.waybills,
            carTabInfo: payload.carTabInfo,
            isLoading: false,
          },
        };
      }
      return newState;
    }
    case CAR_INFO_RESET_MISSIONS_AND_WAYBILLS_DATA: {
      return {
        ...state,
        missionsAndWaybillsData: { ...initialState.missionsAndWaybillsData },
      };
    }
    case CAR_INFO_PUSH_POINT_INTO_TRACK: {
      if (payload.point.id !== state.gps_code || !state.trackCaching.track || state.trackCaching.track === -1) {
        return state;
      }

      let lastTrackData = [];
      if (isArray(state.trackCaching.track)) {
        lastTrackData = state.trackCaching.track;
      }

      return {
        ...state,
        trackCaching: {
          ...state.trackCaching,
          track: [
            ...lastTrackData,
            {
              ...payload.point,
              speed_avg: payload.point.speed,
            },
          ],
        },
      };
    }
    case CAR_INFO_TOGGLE_FOR_TODAY: {
      return {
        ...state,
        forToday: !state.forToday,
        date_start: !state.forToday ? getTrackDefaultDateStart() : state.date_start,
        date_end: !state.forToday ? getTrackDefaultDateEnd() : state.date_end,
      };
    }
    case CAR_INFO_CHANGE_DATE_AND_FOR_TODAY: {
      return {
        ...state,
        forToday: payload.forToday,
        date_start: payload.date_start,
        date_end: payload.date_end,
      };
    }
    case CAR_INFO_RESET_TRACK_CACHING: {
      return {
        ...state,
        trackCaching: { ...initialState.trackCaching },
      };
    }
    case CAR_INFO_CHANGE_DATE: {
      return {
        ...state,
        [payload.field]: payload.value,
      };
    }
    case CAR_INFO_TOGGLE_PLAY: {
      return {
        ...state,
        playTrack: {
          ...state.playTrack,
          status: state.playTrack.status === 'play' ? 'pause' : 'play',
        },
      };
    }
    case CAR_INFO_STOP_PLAY: {
      return {
        ...state,
        playTrack: {
          ...initialState.playTrack,
        },
      };
    }
    case CAR_INFO_INC_TRACK_POINT_INDEX: {
      return {
        ...state,
        playTrack: {
          ...state.playTrack,
          trackPointIndex: state.playTrack.trackPointIndex + 1,
        },
      };
    }
    case CAR_INFO_TOGGLE_SENSOR_SHOW: {
      return {
        ...state,
        trackCaching: {
          ...state.trackCaching,
          [`front_cars_sensors_${payload.type}`]: {
            ...state.trackCaching[`front_cars_sensors_${payload.type}`],
            [payload.key]: {
              ...state.trackCaching[`front_cars_sensors_${payload.type}`][payload.key],
              show: !state.trackCaching[`front_cars_sensors_${payload.type}`][payload.key].show,
            },
          },
        },
      };
    }
    case CAR_INFO_TOGGLE_STATUS_TC_FOLLOW_ON_CAR: {
      const { statusTC } = state;
      const FOLLOW_ON_CAR = !statusTC.FOLLOW_ON_CAR;

      return {
        ...state,
        statusTC: {
          ...statusTC,
          FOLLOW_ON_CAR,
        },
      };
    }
    case CAR_INFO_SET_POPUP_TRACK_POINT: {
      return {
        ...state,
        popups: {
          ...state.popups,
          trackPoint: payload.trackPoint,
        },
      };
    }
    case CAR_INFO_SET_POPUP_PARKING_POINT: {
      return {
        ...state,
        popups: {
          ...state.popups,
          parkingPoint: payload.parkingPoint,
        },
      };
    }
    case CAR_INFO_SET_POPUP_FUEL_EVENT_POINT: {
      return {
        ...state,
        popups: {
          ...state.popups,
          fuelEventPoint: payload.fuelEventPoint,
        },
      };
    }
    default: {
      return state;
    }
  }
};
