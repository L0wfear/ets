import { Store } from 'flummox';

export default class ODHStore extends Store {

  constructor(flux) {
    super();

    const actions = flux.getActions('odh');
    this.register(actions.getODHNorm, this.handleGetODHNorm);
    this.register(actions.updateODHNorm, this.handleGetODHNorm);
    this.register(actions.createODHNorm, this.handleGetODHNorm);
    this.register(actions.deleteODHNorm, this.handleGetODHNorm);
    this.register(actions.getODHNormDataSummer, this.handleGetODHNormDataSummer);
    this.register(actions.updateODHNormDataSummer, this.handleGetODHNormDataSummer);
    this.register(actions.createODHNormDataSummer, this.handleGetODHNormDataSummer);
    this.register(actions.deleteODHNormDataSummer, this.handleGetODHNormDataSummer);
    this.register(actions.getEfficiency, this.handleGetEfficiency);
    this.register(actions.updateEfficiency, this.handleGetEfficiency);
    this.register(actions.createEfficiency, this.handleGetEfficiency);
    this.register(actions.deleteEfficiency, this.handleGetEfficiency);

    this.state = {
      odhNormList: [],
      efficiencyList: [],
    };
  }

  handleGetODHNorm({ result }) {
    this.setState({ odhNormList: result });
  }

  handleGetODHNormDataSummer({ result }) {
    this.setState({ odhNormDataSummerList: result });
  }

  handleGetEfficiency({ result }) {
    this.setState({ efficiencyList: result });
  }

}
