import { Store } from 'flummox';
import _ from 'lodash';

class SettingsStore extends Store {

  constructor(flux) {
    super();

    const settingsActions = flux.getActions('settings');

    this.register(settingsActions.setShowPlates, this.handleSetShowPlates);
    this.register(settingsActions.setShowTrack, this.handleSetShowTrack);

    this.state = {
      showPlates: false,
      showTrack: true
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

}

export default SettingsStore;
