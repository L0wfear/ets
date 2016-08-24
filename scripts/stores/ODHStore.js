import { Store } from 'flummox';
import _ from 'lodash';

class ODHStore extends Store {

  constructor(flux) {
    super();

    const actions = flux.getActions('odh');
    this.register(actions.getODHSupportStandards, this.handleGetODHSupportStandards);
    this.register(actions.updateODHSupportStandard, this.handleGetODHSupportStandards);
    this.register(actions.createODHSupportStandard, this.handleGetODHSupportStandards);
    this.register(actions.getODHSupportStandardsDataSummer, this.handleGetODHSupportStandardsDataSummer);
    this.register(actions.updateODHSupportStandardDataSummer, this.handleGetODHSupportStandardsDataSummer);
    this.register(actions.createODHSupportStandardDataSummer, this.handleGetODHSupportStandardsDataSummer);
    this.register(actions.createODHSupportStandardDataSummer, this.handleGetODHSupportStandardsDataSummer);

    this.state = {
      odhSupportStandardsList: [],
    };

  }

  handleGetODHSupportStandards({result}) {
    this.setState({odhSupportStandardsList: result});
	}

  handleGetODHSupportStandardsDataSummer({result}) {
    this.setState({odhSupportStandardsDataSummerList: result});
	}

}

export default ODHStore;
