import { Store } from 'flummox';
import _ from 'lodash';

class ReportsStore extends Store {

  constructor(flux) {
    super();

    const reportsActions = flux.getActions('reports');
    this.register(reportsActions.getDailyCleaningReports, this.handleGetDailyCleaningReports);
    this.register(reportsActions.getFuelReport, this.handleGetFuelReport);
    this.register(reportsActions.createDailyCleaningReport, this.handleGetDailyCleaningReports);
    this.register(reportsActions.getWeeklyTechnicalOperationCompleteReports, this.handleGetWeeklyTechnicalOperationCompleteReports);
    this.register(reportsActions.createWeeklyTechnicalOperationCompleteReport, this.handleGetWeeklyTechnicalOperationCompleteReports);

    this.state = {
      dailyCleaningReportsList: [],
      fuelReport: [],
      weeklyTechnicalOperationCompleteReportsList: []
    };

  }

  handleGetFuelReport(e) {
    this.setState({fuelReport: e.result});
  }

  handleGetDailyCleaningReports(dailyCleaningReports) {
    this.setState({dailyCleaningReportsList: dailyCleaningReports.result});
  }

  handleGetWeeklyTechnicalOperationCompleteReports(weeklyTechnicalOperationCompleteReports) {
    this.setState({weeklyTechnicalOperationCompleteReportsList: weeklyTechnicalOperationCompleteReports.result});
  }

}

export default ReportsStore;
