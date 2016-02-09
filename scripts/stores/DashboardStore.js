import { Store } from 'flummox';
import _ from 'lodash';

class DashboardStore extends Store {

  constructor(flux) {
    super();
    this.flux = flux;

    const dashboardActions = flux.getActions('dashboard');

    this.register(dashboardActions.getDashboardCurrentMissions, this.handleGetDashboardComponent.bind(this, 'current_missions', 1));
    this.register(dashboardActions.getDashboardFutureMissions, this.handleGetDashboardComponent.bind(this, 'future_missions', 2));

    this.register(dashboardActions.getDashboardCarInWork, this.handleGetDashboardSideComponent.bind(this, 'car_in_work', 8));
    this.register(dashboardActions.getDashboardReleasedWaybill, this.handleGetDashboardSideComponent.bind(this, 'released_waybill', 16));

    this.state = {
      componentsIndex: {},
      componentsSideIndex: {},
      componentsList: [],
      componentsSideList: [],
    };

  }

  handleGetDashboardComponent(key, id, component) {
    let { componentsList, componentsIndex } = this.state;
    component.result.id = id;
    componentsIndex[key] = component.result;
    componentsList = _.toArray(componentsIndex);
    this.setState({componentsIndex, componentsList});
	}

  handleGetDashboardSideComponent(key, id, component) {
    let { componentsSideList, componentsSideIndex } = this.state;
    component.result.id = id;
    component.result.key = key;
    componentsSideIndex[key] = component.result;
    componentsSideList = _.toArray(componentsSideIndex);
    this.setState({componentsSideIndex, componentsSideList});
  }

  resetState() {
    this.setState({
      componentsIndex: {},
      componentsSideIndex: {},
      componentsList: [],
      componentsSideList: [],
    });
  }

}

export default DashboardStore;
