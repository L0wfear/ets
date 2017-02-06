import { Store } from 'flummox';

export default class RoutesStore extends Store {

  constructor(flux) {
    super();

    const routesActions = flux.getActions('routes');
    this.register(routesActions.createRoute, this.handleGetRoutes);
    this.register(routesActions.getRoutes, this.handleGetRoutes);
    this.register(routesActions.removeRouteVector, this.handleGetRoutesVector);
    this.register(routesActions.updateRouteVector, this.handleGetRoutesVector);
    this.register(routesActions.updateRoute, this.handleGetRoutes);
    this.register(routesActions.removeRoute, this.handleGetRoutes);
    this.register(routesActions.getRouteReports, this.handleGetRouteReports);
    this.register(routesActions.createRouteReport, this.handleGetRouteReports);
    this.register(routesActions.getRouteReportById, this.handleGetRouteReportById);

    this.state = {
      routesList: [],
      reportsList: [],
      selectedReportData: [],
    };
  }

  handleGetRoutes(routes) {
    this.setState({ routesList: routes.result || routes.routes.result });
  }

  handleGetRouteReports(reports) {
    this.setState({ reportsList: reports.result.rows });
  }

  handleGetRouteReportById(report) {
    this.setState({ selectedReportData: report.result.rows });
  }
}
