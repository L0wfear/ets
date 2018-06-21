import { actionsFactory, handleActions } from 'redux/utils/actions';

import {
  CarInfoService,
  TrackService,
} from 'api/Services';
import { getStartOfToday, makeUnixTime } from 'utils/dates';
import { swapCoords } from 'utils/geo';
import { getDataAboutPointTrack, getTrackColor } from 'utils/track';

import { TRACK_LINE_OPACITY } from 'constants/track.js';

const PATH = 'ets/oneCarInfo';
const createAction = actionsFactory(PATH);

const SET_TRACK_DATA = 'loadTrack';
const SET_CAR_INFO_DATA = 'setCarInfoData';
const SET_INITIAL_STATE = 'setIntitialState';
const ADD_POINT_TO_TRACK = 'addPointToTrack';

const initialState = {
  missions: [],
  max_speed: 0,
  imageUrl: null,
  trackData: {
    id: 0,
    from_dt: '',
    to_dt: '',
    cars_sensors: {},
    consumptions: {},
    distance: 0,
    duration: 0,
    duration_moving: 0,
    equipment: {},
    equipment_distance: 0,
    equipment_time: 0,
    events: {},
    isFreezed: false,
    parkings: [],
    sensors: {},
    sensors_data: {},
    time_of_parking: 0,
    track: [],
    track_length: 0,
    trackLines: [],
  },
};

export const setCarInfoData = createAction(SET_CAR_INFO_DATA);
export const setTrackData = createAction(SET_TRACK_DATA);
export const setIntitialState = createAction(SET_INITIAL_STATE);
export const addPointToTrack = createAction(ADD_POINT_TO_TRACK,
  ({ point, max_speed }) => ({ point: getDataAboutPointTrack(point), max_speed }),
);

export const loadCarInfo = props => (dispatch) => {
  const { car_id } = props;
  const payload = {
    car_id,
  };

  return CarInfoService.get(payload)
    .then(({ result = {} }) => {
      dispatch(setCarInfoData(result));
      return result;
    });
};

/**
 * @todo Привязка к текущей выбранной машине
 */
export const loadTrack = props => (dispatch, getState) => {
  const {
    id,
    from_dt = getStartOfToday(),
    to_dt = new Date().getTime(),
  } = props;
/*
  const {
    id,
    from_dt = new Date(2018, 0, 18).getTime(),
    to_dt = new Date(2018, 0, 19).getTime(),
  } = props;
  */
  const {
    oneCarInfo: { max_speed },
    carsPoints: { selectedCarId },
  } = getState();

  const payload = {
    version: 3,
    gps_code: id,
    from_dt: makeUnixTime(from_dt),
    to_dt: makeUnixTime(to_dt),
    sensors: 1,
  };

  dispatch(setIntitialState());

  return TrackService.get(payload)
      .then((obj) => {
        const { carsPoints: { selectedCarId: currSelectedCarId } } = getState();

        if (currSelectedCarId === selectedCarId) {
          const track_length = obj.track.length;

          if (track_length > 1) {
            const trackLines = [];
            let prevPointTrack = getDataAboutPointTrack({ ...obj.track[0], max_speed });

            const isFreezed = {
              val: true,
              coords_msk: swapCoords(obj.track[0].coords_msk),
            };

            const track = [{ ...prevPointTrack }];

            obj.track.forEach((tr, i) => {
              if (i < track_length - 1) {
                const nextTrackPoint = getDataAboutPointTrack({ ...obj.track[i + 1], max_speed });

                trackLines.push({
                  pointOne: { ...prevPointTrack },
                  pointTwo: { ...nextTrackPoint },
                  color: getTrackColor({ speed: prevPointTrack.speed_avg, maxSpeed: max_speed, opacity: TRACK_LINE_OPACITY }),
                });

                if (isFreezed.val) {
                  isFreezed.val = isFreezed.coords_msk[0] !== nextTrackPoint.coords_msk[0] || isFreezed.coords_msk[1] !== nextTrackPoint.coords_msk[1];
                  isFreezed.coords_msk = nextTrackPoint.coords_msk;
                }

                prevPointTrack = nextTrackPoint;
                track.push(nextTrackPoint);
              }
            });

            const parkings = obj.parkings.map(p => ({
              ...p,
              needShiftIcon: false,
              start_point: {
                ...p.start_point,
                coords: swapCoords(p.start_point.coords),
                coords_msk: swapCoords(p.start_point.coords_msk),
              },
              end_point: {
                ...p.end_point,
                coords: swapCoords(p.end_point.coords),
                coords_msk: swapCoords(p.end_point.coords_msk),
              },
            }));

            const events = Object.entries(obj.events).reduce((newObj, [key, sensor]) => {
              newObj[key] = sensor.map((event) => {
                const newEvent = {
                  ...event,
                  needShiftIcon: false,
                  start_point: {
                    ...event.start_point,
                    coords: swapCoords(event.start_point.coords),
                    coords_msk: swapCoords(event.start_point.coords_msk),
                  },
                  end_point: {
                    ...event.end_point,
                    coords: swapCoords(event.end_point.coords),
                    coords_msk: swapCoords(event.end_point.coords_msk),
                  },
                };
                const { start_point: { coords_msk } } = newEvent;

                const parkingIndex = parkings.findIndex(({ start_point: { coords_msk: parkingCoord } }) => coords_msk.toString() === parkingCoord.toString());
                if (parkingIndex !== -1) {
                  parkings[parkingIndex].needShiftIcon = true;
                  newEvent.needShiftIcon = true;
                }

                return newEvent;
              });

              return newObj;
            }, {});

            dispatch(setTrackData({
              id,
              from_dt,
              to_dt,
              ...obj,
              track,
              track_length,
              trackLines,
              parkings,
              events,
              isFreezed: isFreezed.val,
            }));
          }
        }

        return obj;
      });
};


const reducer = handleActions({
  [setIntitialState]: () => ({ ...initialState }),
  [setCarInfoData]: {
    next(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  [setTrackData]: {
    next(state, { payload }) {
      return {
        ...state,
        trackData: { ...payload },
      };
    },
  },
  [addPointToTrack]: {
    next(state, { payload: { point, max_speed } }) {
      /*
      const {
        trackData: {
          track: old_track,
          track_length: old_track_length,
          trackLines: old_trackLines,
        },
      } = state;
      let track;
      let trackLines;

      const { point_two: point_one } = old_trackLines[old_track_length - 2];
      let track_length = old_track_length + 1;

      if (track_length > 5000) {
        track_length = 5000;
        [, ...track] = [...old_track, point];
        [, ...trackLines] = [
          ...old_trackLines,
          {
            point_one,
            point_two: point,
            color: getTrackColor({ speed: point_one.speed_max, maxSpeed: max_speed, opacity: TRACK_LINE_OPACITY }),
          },
        ]
      }
      */
      return {
        ...state,
      }; 
    },
  },
}, initialState);

export default reducer;
