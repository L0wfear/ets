import {
  CAR_INFO_SET_GPS_CODE,
  CAR_INFO_SET_STATUS,
  CAR_INFO_SET_TRACK_CACHING,
  CAR_INFO_SET_MISSIONS_DATA,
  CAR_INFO_RESET_MISSIONS_DATA,
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
  initialState,
} from 'components/monitor/new/info/car-info/redux/modules/car-info';
import { makeUnixTime, createValidDateTime, diffDayOfDate } from 'utils/dates';
import { getMaxSpeeds, checkAndModifyTrack, checkOnMkad } from 'components/monitor/new/info/car-info/redux/modules/utils';
import { TypeMeta } from 'redux/trash-actions/@types/common.h';

import {
  Car,
  TrackService,
  CarInfoService,
} from 'api/Services';

export const carInfoSetGpsNumber = (gps_code = null, gov_number = null) => ({
  type: CAR_INFO_SET_GPS_CODE,
  payload: {
    gps_code,
    gov_number,
  }
});

export const carInfoSetStatus = (status) => ({
  type: CAR_INFO_SET_STATUS,
  payload: {
    status,
  }
});

export const carInfoToggleForToday = () => ({
  type: CAR_INFO_TOGGLE_FOR_TODAY,
  payload: {},
});

export const carInfoChangeDate = (field, value) => ({
  type: CAR_INFO_CHANGE_DATE,
  payload: {
    field,
    value,
  }
})
export const carInfoSetTrack = (trackCaching, gps_code, odh_mkad) => ({
  type: CAR_INFO_SET_TRACK_CACHING,
  payload: {
    trackCaching: {
      ...trackCaching,
      ...checkAndModifyTrack(trackCaching, odh_mkad),
    },
    error: false,
    gps_code,
  }
});

export const carInfoSetMissionsData = ({ missions }, gps_code) => ({
  type: CAR_INFO_SET_MISSIONS_DATA,
  payload: {
    missions: missions,
    ...getMaxSpeeds(missions),
    gps_code,
  }
});

export const carInfoResetTrackCahing = () => ({
  type: CAR_INFO_RESET_TRACK_CACHING,
  payload: {},  
});

export const carInfoResetMissionsData = () => ({
  type: CAR_INFO_RESET_MISSIONS_DATA,
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
})

export const carInfoToggleSensorShow = (type, key) => ({
  type: CAR_INFO_TOGGLE_SENSOR_SHOW,
  payload: {
    type,
    key,
  }
})



export const getCarGpsNumberByDateTime = ({ asuods_id, gps_code, date_start }) => {
  if (diffDayOfDate(new Date(), date_start) > 0) {
    const payloadToCar = {
      asuods_id,
      datetime: createValidDateTime(date_start),
    };

    return Car.get(payloadToCar).then(({ result: { rows: [carData] } }) => carData);
  }

  return Promise.resolve({ gps_code });
}

export const fetchTrack = (payloadData, odh_mkad, meta = { loading: true } as TypeMeta) => (dispatch) => {
  dispatch(carInfoResetTrackCahing())
  dispatch({
    type: CAR_INFO_SET_TRACK_CACHING,
    payload: getCarGpsNumberByDateTime(payloadData)
      .then(({ gps_code }) => {
        const payloadToTrack = {
          version: 3,
          gps_code,
          from_dt: makeUnixTime(payloadData.date_start),
          to_dt: makeUnixTime(payloadData.date_end),
          sensors: 1,
        };

        return TrackService.get(payloadToTrack).then(ans => (
          carInfoSetTrack(ans, payloadData.gps_code, odh_mkad).payload
        ));
      })
      .catch((error) => {
        console.log(error)
        return {
          trackCaching: {
            ...initialState.trackCaching,
            error: true,
          },
          gps_code: payloadData.gps_code,
        };
      }),
    meta: {
      ...meta,
    },
  });
};

export const fetchCarInfo = (payloadData, meta = { loading: true } as TypeMeta) => (dispatch) => {
  dispatch(carInfoResetMissionsData());
  dispatch({
    type: CAR_INFO_SET_MISSIONS_DATA,
    payload: CarInfoService.get({
      car_id: payloadData.asuods_id,
      date_start: createValidDateTime(payloadData.date_start),
      date_end: createValidDateTime(payloadData.date_end),
    }).then((ans) => {
      return carInfoSetMissionsData(ans.result, payloadData.gps_code).payload
    })
    .catch((error) => ({
      ...initialState.missionsData,
      error: true,
      gps_code: payloadData.gps_code,
    })),
    meta: {
      ...meta,
    },
  });
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
  }
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

