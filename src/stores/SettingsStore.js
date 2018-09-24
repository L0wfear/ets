import { Store } from 'flummox';
import cloneDeep from 'lodash/cloneDeep';

const initialState = {
  showPlates: false,
  showTrack: true,
  showPolygons: true,
  showSelectedElement: true,
  showGeoobjects: false,
  showMarkers: true,
};

export default class SettingsStore extends Store {
  constructor(flux) {
    super();

    const settingsActions = flux.getActions('settings');

    // TODO make 1 handler with type binding
    this.register(settingsActions.setShowPlates, this.handleSetShowPlates);
    this.register(settingsActions.setShowTrack, this.handleSetShowTrack);
    this.register(settingsActions.setShowPolygons, this.handleSetShowPolygons);
    this.register(settingsActions.setShowSelectedElement, this.handleSetShowSelectedElement);
    this.register(settingsActions.setShowGeoobjects, this.handleSetShowGeoobjects);
    this.register(settingsActions.setShowMarkers, this.handleSetShowMarkers);
    this.register(settingsActions.setInitialState, this.handleClearStore);

    this.state = cloneDeep(initialState);
  }

  handleSetShowPlates(showPlates) {
    this.setState({
      showPlates,
    });
  }

  handleSetShowGeoobjects(showGeoobjects) {
    this.setState({
      showGeoobjects,
    });
  }

  handleSetShowMarkers(showMarkers) {
    this.setState({
      showMarkers,
    });
  }

  handleSetShowTrack(showTrack) {
    if (typeof showTrack === 'undefined') {
      showTrack = !this.state.showTrack;
    }
    this.setState({
      showTrack,
    });
  }

  handleSetShowPolygons(showPolygons) {
    if (typeof showPolygons === 'undefined') {
      showPolygons = !this.state.showPolygons;
    }
    this.setState({
      showPolygons,
    });
  }

  handleSetShowSelectedElement(showSelectedElement) {
    if (typeof showSelectedElement === 'undefined') {
      showSelectedElement = !this.state.showSelectedElement;
    }
    this.setState({
      showSelectedElement,
    });
  }

  handleClearStore() {
    this.state = cloneDeep(initialState);
  }
}
