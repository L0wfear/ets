import { Store } from 'flummox';
import _ from 'lodash';

class DashboardStore extends Store {

  constructor(flux) {
    super();
    this.flux = flux;

    const dashboardActions = flux.getActions('dashboard');
    this.register(dashboardActions.getDashboardComponent, this.handleGetDashboardComponent);
    this.register(dashboardActions.getDashboardSideComponent, this.handleGetDashboardSideComponent);

    this.state = {
      dispatcher: {
        componentsIndex: {},
        componentsSideIndex: {},
        componentsList: [],
        componentsSideList: [],
      },
      master: {
        componentsIndex: {},
        componentsSideIndex: {},
        componentsList: [],
        componentsSideList: [],
      }
    };

  }

  handleGetDashboardComponent({role, key, id, component}) {
    let { componentsList, componentsIndex } = this.state[role];
    component.result.id = id;
    component.result.key = key;
    componentsIndex[key] = component.result;
    componentsList = _(componentsIndex).toArray().sortBy('id').value();
    let state = this.state;
    state[role].componentsList = componentsList;
    state[role].componentsIndex = componentsIndex;
    this.setState(state);
	}

  handleGetDashboardSideComponent({role, key, id, component}) {
    let { componentsSideList, componentsSideIndex } = this.state[role];
    component.result.id = id;
    component.result.key = key;
    componentsSideIndex[key] = component.result;
    componentsSideList = _(componentsSideIndex).toArray().sortBy('id').value();
    console.log(componentsSideList);
    let state = this.state;
    state[role].componentsSideList = componentsSideList;
    state[role].componentsSideIndex = componentsSideIndex;
    this.setState(state);
  }

}

export default DashboardStore;
