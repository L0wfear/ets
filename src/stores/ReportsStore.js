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
    this.register(reportsActions.getDtCoverageReport, this.handleGetDtCoverageReport);
    this.register(reportsActions.getTrackEventsReport, this.handleGetTrackEventsReport);
    this.register(reportsActions.getTrackEventsReports, this.handleGetTrackEventsReports);
    this.register(reportsActions.getCarFuncTypeUsageReports, this.handleGetCarFuncTypeUsageReports);
    this.register(reportsActions.getCarFuncTypeUsageDetailReport, this.handleGetCarFuncTypeUsageDetailReport);
    this.register(reportsActions.getBrigadeAndEmployeeEfficiencyReport1L, this.handleGetBrigadeAndEmployeeEfficiencyReport1L);
    this.register(reportsActions.getBrigadeEfficiencyReport2L, this.handleGetBrigadeEfficiencyReport2L);
    this.register(reportsActions.getEmployeeEfficiencyReports, this.handleGetEmployeeEfficiencyReports);
    this.register(reportsActions.clearStateList, this.handleClearStateList);

    this.initialState = {
      dailyCleaningReportsListETS: [],
      dailyCleaningReportsListCAFAP: [],
      carFuncTypeUsageReportsList: [],
      carFuncTypeUsageDetailReportList: [],
      fuelReport: [],
      weeklyTechnicalOperationCompleteReportsList: [],
      odhCoverageReport: [],
      dtCoverageReport: [],
      employeeEfficiencyReportsList: [],
      brigadeEfficiencyReport1L: [],
      brigadeEfficiencyReport2L: [],
      trackEventsReport: [],
      trackEventsReports: [],
    };

    this.state = this.initialState;
  }

  handleGetFuelReport({ result }) {
    this.setState({ fuelReport: result.rows });
  }

  handleGetTrackEventsReport({ result }) {
    this.setState({ trackEventsReport: result.rows });
  }

  handleGetTrackEventsReports({ result }) {
    this.setState({ trackEventsReports: result.rows });
  }

  handleGetCarFuncTypeUsageReports({ result }) {
    this.setState({ carFuncTypeUsageReportsList: result.rows });
  }

  handleGetCarFuncTypeUsageDetailReport({ result }) {
    this.setState({ carFuncTypeUsageDetailReportList: result.rows });
  }

  handleGetBrigadeAndEmployeeEfficiencyReport1L({ result }) {
    this.setState({ brigadeAndEmployeeEfficiencyReport1L: result.rows });
  }

  handleGetBrigadeEfficiencyReport2L({ result }) {
    this.setState({ brigadeEfficiencyReport2L: result.rows });
  }

  handleGetEmployeeEfficiencyReports({ result }) {
    this.setState({ employeeEfficiencyReportsList: result.rows });
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
