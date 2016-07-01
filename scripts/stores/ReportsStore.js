import { Store } from 'flummox';
import _ from 'lodash';

class ReportsStore extends Store {

  constructor(flux) {
    super();

    const reportsActions = flux.getActions('reports');
    this.register(reportsActions.getDailyCleaningReportsETS, this.handleGetDailyCleaningReportsETS);
    this.register(reportsActions.getFuelReport, this.handleGetFuelReport);
    this.register(reportsActions.createDailyCleaningReportETS, this.handleGetDailyCleaningReportsETS);
    this.register(reportsActions.getWeeklyTechnicalOperationCompleteReports, this.handleGetWeeklyTechnicalOperationCompleteReports);
    this.register(reportsActions.createWeeklyTechnicalOperationCompleteReport, this.handleGetWeeklyTechnicalOperationCompleteReports);

    this.state = {
      dailyCleaningReportsListETS: [],
      fuelReport: [],
      weeklyTechnicalOperationCompleteReportsList: []
    };

  }

  handleGetFuelReport(e) {
    this.setState({fuelReport: e.results});
  }

  handleGetDailyCleaningReportsETS(dailyCleaningReports) {
    this.setState({dailyCleaningReportsListETS: dailyCleaningReports.result});
  }

  handleGetWeeklyTechnicalOperationCompleteReports(weeklyTechnicalOperationCompleteReports) {
    this.setState({weeklyTechnicalOperationCompleteReportsList: weeklyTechnicalOperationCompleteReports.result});
  }

}

export default ReportsStore;
