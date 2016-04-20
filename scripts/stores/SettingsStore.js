import { Store } from 'flummox';
import _ from 'lodash';

class SettingsStore extends Store {

  constructor(flux) {
    super();

    const settingsActions = flux.getActions('settings');

    this.register(settingsActions.setShowPlates, this.handleSetShowPlates);
    this.register(settingsActions.setShowTrack, this.handleSetShowTrack);
    this.register(settingsActions.setShowRoute, this.handleSetShowRoute);
    this.register(settingsActions.setShowSelectedElement, this.handleSetShowSelectedElement);

    this.state = {
      showPlates: false,
      showTrack: true,
      showRoute: true,
      showSelectedElement: true
    };

  }

  handleSetShowPlates(showPlates) {
    this.setState({
      showPlates
    });
  }

  handleSetShowTrack(showTrack) {
    if (typeof showTrack === 'undefined') {
      showTrack = !this.state.showTrack;
    }
    this.setState({
      showTrack
    });
  }

  handleSetShowRoute(showRoute) {
    if (typeof showRoute === 'undefined') {
      showRoute = !this.state.showRoute;
    }
    this.setState({
      showRoute
    });
  }

  handleSetShowSelectedElement(showSelectedElement) {
    if (typeof showSelectedElement === 'undefined') {
      showSelectedElement = !this.state.showSelectedElement;
    }
    this.setState({
      showSelectedElement
    });
  }

}

export default SettingsStore;
