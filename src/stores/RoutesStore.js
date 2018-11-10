import { Store } from 'flummox';

export default class RoutesStore extends Store {
  constructor(flux) {
    super();

    const routesActions = flux.getActions('routes');
    this.register(routesActions.createRoute, this.handleGetRoutes);
    this.register(routesActions.getRoutes, this.handleGetRoutes);
    this.register(routesActions.updateRoute, this.handleGetRoutes);
    this.register(routesActions.removeRoute, this.handleGetRoutes);

    this.state = {
      routesList: [],
      reportsList: [],
      selectedReportData: [],
    };
  }

  handleGetRoutes(routes) {
    this.setState({ routesList: routes.result || routes.routes.result });
  }
}
