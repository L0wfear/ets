import { Store } from 'flummox';

export default class ReportsStore extends Store {

  constructor(flux) {
    super();

    const reportsActions = flux.getActions('reports');
    this.register(reportsActions.getDailyCleaningReportsETS, this.handleGetDailyCleaningReportsETS);
    this.register(reportsActions.getDailyCleaningReportsCAFAP, this.handleGetDailyCleaningReportsCAFAP);
    this.register(reportsActions.createDailyCleaningReportETS, this.handleGetDailyCleaningReportsETS);
    this.register(reportsActions.createDailyCleaningReportCAFAP, this.handleGetDailyCleaningReportsCAFAP);
    this.register(reportsActions.getFuelReport, this.handleGetFuelReport);
    this.register(reportsActions.getWeeklyTechnicalOperationCompleteReports, this.handleGetWeeklyTechnicalOperationCompleteReports);
    this.register(reportsActions.createWeeklyTechnicalOperationCompleteReport, this.handleGetWeeklyTechnicalOperationCompleteReports);
    this.register(reportsActions.getOdhCoverageReport, this.handleGetOdhCoverageReport);
    this.register(reportsActions.getCarFuncTypeUsageReports, this.handleGetCarFuncTypeUsageReports);

    this.state = {
      dailyCleaningReportsListETS: [],
      dailyCleaningReportsListCAFAP: [],
      carFuncTypeUsageReportsList: [],
      fuelReport: [],
      weeklyTechnicalOperationCompleteReportsList: [],
      odhCoverageReport: [],
    };
  }

  handleGetFuelReport({ result }) {
    this.setState({ fuelReport: result.rows });
  }

  handleGetCarFuncTypeUsageReports({ result }) {
    this.setState({ carFuncTypeUsageReportsList: result.rows });
  }

  handleGetDailyCleaningReportsETS(dailyCleaningReports) {
    this.setState({ dailyCleaningReportsListETS: dailyCleaningReports.result.rows });
  }

  handleGetDailyCleaningReportsCAFAP(dailyCleaningReports) {
    this.setState({ dailyCleaningReportsListCAFAP: dailyCleaningReports.result.rows });
  }

  handleGetWeeklyTechnicalOperationCompleteReports(weeklyTechnicalOperationCompleteReports) {
    this.setState({ weeklyTechnicalOperationCompleteReportsList: weeklyTechnicalOperationCompleteReports.result.rows });
  }

  handleGetOdhCoverageReport({ result }) {
    this.setState({ odhCoverageReport: result.rows });
  }

}
