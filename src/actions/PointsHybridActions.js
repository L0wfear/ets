import { Actions } from 'flummox';

export default class PointsActions extends Actions {

  updatePoints(data) {
    return data;
  }

  setFilter(data) {
    return data;
  }

  setTracking(value) {
    return value;
  }

  selectPoint(point) {
    return point;
  }

  createConnection() {
    return true;
  }

  closeConnection() {
    return true;
  }

  setSingleCarTrack(gov_number, singleCarAsuodsId) {
    return { gov_number, singleCarAsuodsId };
  }

  setSingleCarTrackDates(dates) {
    return dates;
  }

}
