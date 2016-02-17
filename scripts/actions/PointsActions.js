import { Actions } from 'flummox';

export default class PointsActions extends Actions {

  updateTrack( data ){
    return data
  }

  updatePoints(data) {
    return data;
  }

  setFilter(data) {
    return data;
  }

  setTracking(value){
    return value
  }

  selectPoint(point) {
    return point;
  }

  receiveTrack(carId, track) {
    return [carId, track];
  }

  setShowPlates(showPlates) {
    return showPlates;
  }

  createConnection() {
    return true;
  }

  closeConnection() {
    return true;
  }

}
