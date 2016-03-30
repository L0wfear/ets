import { Store } from 'flummox';
import _ from 'lodash';

class ReportsStore extends Store {

  constructor(flux) {
    super();

    const reportsActions = flux.getActions('reports');

    this.state = {
      dailyCleaningReports: [],
    };

  }

  handleGetFuelRates(rates) {
    this.setState({ rates: rates.result });
  }

}

export default ReportsStore;
