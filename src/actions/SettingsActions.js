import { Actions } from 'flummox';

export default class SettingsActions extends Actions {

  setShowPlates(showPlates) {
    return showPlates;
  }

  setShowTrack(showTrack) {
    return showTrack;
  }

  setShowPolygons(showPolygons) {
    return showPolygons;
  }

  setShowGeoobjects(showGeoobjects) {
    return showGeoobjects;
  }

  setShowSelectedElement(showSelectedElement) {
    return showSelectedElement;
  }

  setShowMarkers(showMarkers) {
    return showMarkers;
  }

}
