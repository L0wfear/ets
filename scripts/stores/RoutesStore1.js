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
    this.register(routesActions.getRoutesVector, this.handleGetRoutesVector);
    this.register(routesActions.updateRoute, this.handleGetRoutes);
    this.register(routesActions.removeRoute, this.handleGetRoutes);
    this.register(routesActions.getRouteReports, this.handleGetRouteReports);
    //this.register(routesActions.getRouteById, this.handleGetRouteById);

    this.state = {
      routesList: [],
      routesVectorList: [],
      reportsList: [],
      //selectedRoute: null,
    };

  }

  handleGetRoutes(routes) {
    this.setState({ routesList: routes.result });
  }

  handleGetRoutesVector(routes) {
    this.setState({ routesVectorList: routes.result });
  }

  handleGetRouteReports(reports) {
    let reportsList = [];
    reports.result.map( resByTechOp => {
      if (resByTechOp.result && resByTechOp.result.rows)
      reportsList = reportsList.concat(resByTechOp.result.rows);
    })
    this.setState({reportsList});
  }

  getRouteById(id) {
    return _.find(this.state.routesList, r => r.id === id) || {};
  }

}


export default RoutesStore;
