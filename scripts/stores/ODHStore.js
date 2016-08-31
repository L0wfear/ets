import { Store } from 'flummox';
import _ from 'lodash';

class ODHStore extends Store {

  constructor(flux) {
    super();

    const actions = flux.getActions('odh');
    this.register(actions.getODHNorm, this.handleGetODHNorm);
    this.register(actions.updateODHNorm, this.handleGetODHNorm);
    this.register(actions.createODHNorm, this.handleGetODHNorm);
    this.register(actions.getODHNormDataSummer, this.handleGetODHNormDataSummer);
    this.register(actions.updateODHNormDataSummer, this.handleGetODHNormDataSummer);
    this.register(actions.createODHNormDataSummer, this.handleGetODHNormDataSummer);
    this.register(actions.createODHNormDataSummer, this.handleGetODHNormDataSummer);

    this.state = {
      odhNormList: [],
    };

  }

  handleGetODHNorm({result}) {
    this.setState({odhNormList: result});
	}

  handleGetODHNormDataSummer({result}) {
    this.setState({odhNormDataSummerList: result});
	}

}

export default ODHStore;
