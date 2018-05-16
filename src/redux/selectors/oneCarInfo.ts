import { createSelector } from 'reselect';
import { getIsShowTrack } from 'redux/selectors/toolbar';

const emptyArr = [];
const emptyObj = {};

export const getTrack = state => state.oneCarInfo.trackData.track;
export const getTrackLines = state => state.oneCarInfo.trackData.trackLines;
export const getTrackParkings = state => state.oneCarInfo.trackData.parkings;
export const getTrackFuelEvents = state => state.oneCarInfo.trackData.events;

export const getTrackByFilter = createSelector(
  getTrack,
  getIsShowTrack,
  (track, isShow) => isShow ? track : emptyArr,
);

export const getTrackLinesByFilter = createSelector(
  getTrackLines,
  getIsShowTrack,
  (trackLines, isShow) => isShow ? trackLines : emptyArr,
);

export const getTrackParkingsByFilter = createSelector(
  getTrackParkings,
  getIsShowTrack,
  (parkings, isShow) => isShow ? parkings : emptyArr,
);

export const getTrackFuelEventsByFilter = createSelector(
  getTrackFuelEvents,
  getIsShowTrack,
  (fuelEvents, isShow) => isShow ? fuelEvents : emptyObj,
);
