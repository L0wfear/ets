import { Actions } from 'flummox';

export default class SettingsActions extends Actions {

  setShowPlates(showPlates) {
    return showPlates;
  }

  setShowTrack(showTrack) {
    return showTrack;
  }

  setShowRoute(showRoute) {
    return showRoute;
  }

  setShowSelectedElement(showSelectedElement) {
    return showSelectedElement;
  }
}
