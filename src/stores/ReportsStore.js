import { Store } from 'flummox';

export default class ReportsStore extends Store {

  constructor(flux) {
    super();

    const reportsActions = flux.getActions('reports');
    this.register(reportsActions.getOdhCoverageReport, this.handleGetOdhCoverageReport);
    this.register(reportsActions.getDtCoverageReport, this.handleGetDtCoverageReport);
    this.register(reportsActions.clearStateList, this.handleClearStateList);

    this.initialState = {
      odhCoverageReport: [],
      dtCoverageReport: [],
    };

    this.state = this.initialState;
  }

  handleGetOdhCoverageReport({ result }) {
    this.setState({ odhCoverageReport: result.rows });
  }

  handleGetDtCoverageReport({ result }) {
    this.setState({ dtCoverageReport: result.rows });
  }

  resetState() {
    this.setState({ ...this.initialState });
  }

  handleClearStateList(listName) {
    this.setState({ [listName]: [] });
  }
}
