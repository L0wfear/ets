import { Actions } from 'flummox';

export default class PointsActions extends Actions {

  updateTrack( data ){
    return data
  }

  updatePoints(data) {
    return data;
  }

  updatePointsInitial(data) {
    return data;
  }

  setFilter(data) {
    return data;
  }

  selectPoint(point) {
    return point;
  }

  receiveTrack(carId, track) {
    return [carId, track];
  }

}
