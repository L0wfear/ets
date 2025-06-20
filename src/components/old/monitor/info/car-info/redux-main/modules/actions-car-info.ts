import {
  CAR_INFO_SET_GPS_CODE,
  CAR_INFO_SET_STATUS,
  CAR_INFO_SET_TRACK_CACHING,
  CAR_INFO_SET_MISSIONS_AND_WAYBILLS_DATA,
  CAR_INFO_RESET_MISSIONS_AND_WAYBILLS_DATA,
  CAR_INFO_PUSH_POINT_INTO_TRACK,
  CAR_INFO_TOGGLE_FOR_TODAY,
  CAR_INFO_RESET_TRACK_CACHING,
  CAR_INFO_CHANGE_DATE,
  CAR_INFO_TOGGLE_PLAY,
  CAR_INFO_STOP_PLAY,
  CAR_INFO_INC_TRACK_POINT_INDEX,
  CAR_INFO_TOGGLE_SENSOR_SHOW,
  CAR_INFO_TOGGLE_STATUS_TC_FOLLOW_ON_CAR,
  CAR_INFO_SET_POPUP_TRACK_POINT,
  CAR_INFO_SET_POPUP_PARKING_POINT,
  CAR_INFO_SET_POPUP_FUEL_EVENT_POINT,
  CAR_INFO_CHANGE_DATE_AND_FOR_TODAY,
  initialState,
} from 'components/old/monitor/info/car-info/redux-main/modules/car-info';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { getMaxSpeeds, checkAndModifyTrack, checkOnMkad, getCarTabInfo } from 'components/old/monitor/info/car-info/redux-main/modules/utils';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

import config from 'config';
import { get } from 'lodash';
import { actionGetTracksCaching } from 'redux-main/reducers/modules/some_uniq/tracks_caching/actions';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { actionGetCarMissionsAndWaybillsByTimestamp } from 'redux-main/reducers/modules/autobase/car/actions';

export const carInfoSetGpsNumber = (gov_number: Car['gov_number'], gps_code: Car['gps_code']): EtsAction<any> => (dispatch, getState) => {  // <<< gps_code
  return dispatch({
    type: CAR_INFO_SET_GPS_CODE,
    payload: {
      gov_number,
      gps_code,
    },
  });
};

export const carInfoSetStatus = (status) => ({
  type: CAR_INFO_SET_STATUS,
  payload: {
    status,
  },
});

export const carInfoToggleForToday = () => ({
  type: CAR_INFO_TOGGLE_FOR_TODAY,
  payload: {},
});

export const carInfoChangeDateAndForToday = (forToday, date_start, date_end) => ({
  type: CAR_INFO_CHANGE_DATE_AND_FOR_TODAY,
  payload: {
    forToday, 
    date_start, 
    date_end,
  },
});

export const carInfoChangeDate = (field, value) => ({
  type: CAR_INFO_CHANGE_DATE,
  payload: {
    field,
    value,
  },
});

export const carInfoSetTrack = (trackCaching, gps_code, odh_mkad) => ({
  type: CAR_INFO_SET_TRACK_CACHING,
  payload: {
    trackCaching: {
      ...trackCaching,
      ...checkAndModifyTrack(trackCaching, odh_mkad),
    },
    error: false,
    gps_code,
  },
});

export const carInfoSetMissionsAndWaybillsData = ({ missions, waybills, carTabInfo }, gps_code) => ({
  type: CAR_INFO_SET_MISSIONS_AND_WAYBILLS_DATA,
  payload: {
    missions,
    waybills,
    ...getMaxSpeeds(missions),
    carTabInfo,
    gps_code,
    isLoading: false,
  },
});

export const carInfoResetTrackCahing = () => ({
  type: CAR_INFO_RESET_TRACK_CACHING,
  payload: {},
});

export const carInfoResetMissionsAndWaybillsData = () => ({
  type: CAR_INFO_RESET_MISSIONS_AND_WAYBILLS_DATA,
  payload: {},
});

export const carInfoTogglePlay = () => ({
  type: CAR_INFO_TOGGLE_PLAY,
  payload: {},
});

export const carInfoStopPlay = () => ({
  type: CAR_INFO_STOP_PLAY,
  payload: {},
});

export const carInfoIncTrackPointIndex = () => ({
  type: CAR_INFO_INC_TRACK_POINT_INDEX,
  payload: {},
});

export const carInfoToggleSensorShow = (type, key) => ({
  type: CAR_INFO_TOGGLE_SENSOR_SHOW,
  payload: {
    type,
    key,
  },
});

export const fetchTrack = (payloadData, meta = { loading: true } as any): EtsAction<any> => async (dispatch, getState) => {
  const odh_mkad = getMonitorPageState(getState()).geoobjects.odh_mkad.data;

  const {
    monitorPage: {
      carInfo: {
        date_start,
        date_end,
      },
    },
  } = getState();

  let version = get(JSON.parse(localStorage.getItem(global.API__KEY) || '{}'), [config.tracksCaching], '');
  const test_version = get(JSON.parse(localStorage.getItem(global.API__KEY) || '{}'), [`TEST::${config.tracksCaching}`], '');

  if (test_version) {
    version = test_version;
  }

  let trackData = null;
  try {
    trackData = await dispatch(
      actionGetTracksCaching(
        {
          version,
          car_id: payloadData.asuods_id,
          date_start: payloadData.date_start || date_start,
          date_end: payloadData.date_end || date_end,
          sensors: 1,
          odh_mkad,
        },
        meta,
      ),
    );
  } catch (error) {
    trackData = {
      ...initialState.trackCaching,
      error: true,
    };
  } finally {
    dispatch(carInfoResetTrackCahing());
  }

  const monitorPage = getMonitorPageState(getState());
  if (monitorPage && monitorPage.carInfo && monitorPage.carInfo.gps_code === payloadData.gps_code) {
    dispatch({
      type: CAR_INFO_SET_TRACK_CACHING,
      payload: {
        trackCaching: trackData,
        gps_code: payloadData.gps_code,
      },
    });
  }
};

export const fetchCarInfo = (payloadData, meta: LoadingMeta): EtsAction<void> => async (dispatch, getState) => {
  const {
    monitorPage: {
      carInfo: {
        date_start,
        date_end,
      },
    },
  } = getState();

  let result = null;
  try {
    result = await dispatch(
      actionGetCarMissionsAndWaybillsByTimestamp(
        {
          car_id: payloadData.asuods_id,
          date_start: createValidDateTime(payloadData.date_start || date_start),
          date_end: createValidDateTime(payloadData.date_end || date_end),
        },
        meta,
      ),
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  } finally {
    dispatch(carInfoResetMissionsAndWaybillsData());
  }

  const monitorPage = getMonitorPageState(getState());
  if (result && monitorPage && monitorPage.carInfo && monitorPage.carInfo.gps_code === payloadData.gps_code) {
    dispatch({
      type: CAR_INFO_SET_MISSIONS_AND_WAYBILLS_DATA,
      payload: {
        missions: result.missions,
        waybills: result.waybills,
        ...getMaxSpeeds(result.missions),
        gps_code: payloadData.gps_code,
        carTabInfo: getCarTabInfo(result),
        isLoading: false,
      },
    });
  }
};

export const carInfoPushPointIntoTrack = (point, odh_mkad) => ({
  type: CAR_INFO_PUSH_POINT_INTO_TRACK,
  payload: {
    point: {
      ...point,
      checkCoordsMsk: {
        onMkad: checkOnMkad(point, odh_mkad),
      },
    },
  },
});

export const carInfoToggleStatusTCFollowOnCar = () => ({
  type: CAR_INFO_TOGGLE_STATUS_TC_FOLLOW_ON_CAR,
  payload: {},
});

export const carInfoSetTrackPoint = (trackPoint = null) => ({
  type: CAR_INFO_SET_POPUP_TRACK_POINT,
  payload: {
    trackPoint,
  },
});

export const carInfoSetParkingPoint = (parkingPoint = null) => ({
  type: CAR_INFO_SET_POPUP_PARKING_POINT,
  payload: {
    parkingPoint,
  },
});

export const carInfoSetFuelEventPoint = (fuelEventPoint = null) => ({
  type: CAR_INFO_SET_POPUP_FUEL_EVENT_POINT,
  payload: {
    fuelEventPoint,
  },
});
