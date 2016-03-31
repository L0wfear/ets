import { Store } from 'flummox';
import _ from 'lodash';

class ReportsStore extends Store {

  constructor(flux) {
    super();

    const reportsActions = flux.getActions('reports');
    this.register(reportsActions.getDailyCleaningReports, this.handleGetDailyCleaningReports);
    this.register(reportsActions.createDailyCleaningReport, this.handleGetDailyCleaningReports);

    this.state = {
      dailyCleaningReportsList: [],
    };

  }

  handleGetDailyCleaningReports(dailyCleaningReports) {
    this.setState({dailyCleaningReportsList: dailyCleaningReports.result});
  }

}

export default ReportsStore;
