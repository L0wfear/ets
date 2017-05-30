import { Store } from 'flummox';

export default class ReportsStore extends Store {

  constructor(flux) {
    super();

    const reportsActions = flux.getActions('reports');
    this.register(reportsActions.getOdhCoverageReport, this.handleGetOdhCoverageReport);
    this.register(reportsActions.getDtCoverageReport, this.handleGetDtCoverageReport);
    this.register(reportsActions.getTrackEventsReport, this.handleGetTrackEventsReport);
    this.register(reportsActions.getTrackEventsReports, this.handleGetTrackEventsReports);
    this.register(reportsActions.getCarFuncTypeUsageReports, this.handleGetCarFuncTypeUsageReports);
    this.register(reportsActions.getCarFuncTypeUsageDetailReport, this.handleGetCarFuncTypeUsageDetailReport);
    this.register(reportsActions.clearStateList, this.handleClearStateList);

    this.initialState = {
      carFuncTypeUsageReportsList: [],
      carFuncTypeUsageDetailReportList: [],
      odhCoverageReport: [],
      dtCoverageReport: [],
      trackEventsReport: [],
      trackEventsReports: [],
    };

    this.state = this.initialState;
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
