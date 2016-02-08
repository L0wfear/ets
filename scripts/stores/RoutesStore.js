import { Store } from 'flummox';
import _ from 'lodash';

class RoutesStore extends Store {

  constructor(flux) {
    super();

    const routesActions = flux.getActions('routes');
    this.register(routesActions.createRoute, this.handleGetRoutes);
    this.register(routesActions.getRoutes, this.handleGetRoutes);
    this.register(routesActions.createVectorRoute, this.handleGetRoutesVector);
    this.register(routesActions.removeRouteVector, this.handleGetRoutesVector);
    this.register(routesActions.updateRouteVector, this.handleGetRoutesVector);
    this.register(routesActions.getRoutesVector, this.handleGetRoutesVector);
    this.register(routesActions.updateRoute, this.handleGetRoutes);
    this.register(routesActions.removeRoute, this.handleGetRoutes);
    this.register(routesActions.getRouteReports, this.handleGetRouteReports);
    this.register(routesActions.createRouteReport, this.handleGetRouteReports);
    this.register(routesActions.getRouteReportById, this.handleGetRouteReportById);
    this.register(routesActions.getGeozones, this.handleGetGeozones);

    this.state = {
      routesList: [],
      routesVectorList: [],
      reportsList: [],
      selectedReportData: [],
      geozonePolys: [],
    };

  }

  handleGetRoutes(routes) {
    this.setState({ routesList: routes.result });
  }

  handleGetRoutesVector(routes) {
    this.setState({ routesVectorList: routes.result });
  }

  handleGetRouteReports(reports) {
    this.setState({reportsList: reports.result});
  }

  handleGetRouteReportById(report) {
    this.setState({selectedReportData: report.result[0].result.rows});
  }

  handleGetGeozones(data) {
    const geozones = data.result;
    let geozonePolys = {};
    geozones.map( g => {
      geozonePolys[g.id] = {
        shape: JSON.parse(g.shape),
        name: g.name,
        state: 1,
      }
    });
    this.setState({geozonePolys});
  }

  getRouteById(id) {
    return _.find(this.state.routesList, r => r.id === id) || {};
  }

  getRouteVectorById(id) {
    return _.find(this.state.routesVectorList, r => r.id === id) || {};
  }

}


export default RoutesStore;
