import { Store } from 'flummox';
import _ from 'lodash';

class SettingsStore extends Store {

  constructor(flux) {
    super();

    const settingsActions = flux.getActions('settings');

    this.register(settingsActions.setShowPlates, this.handleSetShowPlates);

    this.state = {
      showPlates: false
    };

  }

  handleSetShowPlates(showPlates) {
    this.setState({
      showPlates
    });
  }

}

export default SettingsStore;
