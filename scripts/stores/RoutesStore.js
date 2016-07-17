import { Store } from 'flummox';
import _ from 'lodash';

class RoutesStore extends Store {

  constructor(flux) {
    super();

    const routesActions = flux.getActions('routes');
    this.register(routesActions.createRoute, this.handleGetRoutes);
    this.register(routesActions.getRoutes, this.handleGetRoutes);
    this.register(routesActions.createRoute, this.handleCreateRoute);
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
    this.setState({ routesList: routes.result });
  }

  handleCreateRoute({createdRoute, routes}) {
    this.setState({routesList: routes.result});
  }

  handleGetRouteReports(reports) {
    this.setState({reportsList: reports.result});
  }

  handleGetRouteReportById(report) {
    this.setState({selectedReportData: report.result[0].result.rows});
  }

  getRouteById(id) {
    return _.find(this.state.routesList, r => r.id === id) || {};
  }
}


export default RoutesStore;
