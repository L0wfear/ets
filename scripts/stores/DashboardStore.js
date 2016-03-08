import { Store } from 'flummox';
import _ from 'lodash';

const commonComponents = [
  {
    id: 1,
    key: 'current_missions',
  },
  {
    id: 2,
    key: 'future_missions',
  },
  {
    id: 3,
    key: 'count_traveled_routes_by_current_operations',
  },
  {
    id: 6,
    key: 'count_offline_cars',
  },
  {
    id: 7,
    key: 'car_in_work_on_current_missions',
  },
  {
    id: 9,
    key: 'faxogramms',
  },
  {
    id: 13,
    key: 'estimated_time',
  }
]

const componentsByRole = {
  master: [...commonComponents.filter(c => [3, 6, 7, 13].indexOf(c.id) === -1),
    // { временно не показываем
    //   id: 4,
    //   key: 'odh_not_covered_by_current_missions'
    // },
    // {
    //   id: 5,
    //   key: 'odh_not_covered_by_routes',
    // },
    // {
    //   id: 8,
    //   key: 'car_in_work',
    //   side: true,
    // },
    // {
    //   id: 10,
    //   key: 'count_waybill_closed'
    //   side: true,
    // },
    // {
    //   id: 13,
    //   key: 'estimated_time'
    // }
  ],
  dispatcher: [...commonComponents,
    {
      id: 15,
      key: 'count_assigned_routes'
    },
    {
      id: 16,
      key: 'released_waybill',
      side: true,
    },
    {
      id: 18,
      key: 'count_closed_waybill_by_current_operations'
    }
  ]
}

class DashboardStore extends Store {

  constructor(flux) {
    super();
    this.flux = flux;

    const dashboardActions = flux.getActions('dashboard');
    this.register(dashboardActions.getDashboardComponent, this.handleGetDashboardComponent);
    this.register(dashboardActions.getDashboardSideComponent, this.handleGetDashboardSideComponent);

    this.state = {
      componentsIndex: {},
      componentsSideIndex: {},
      componentsList: [],
      componentsSideList: [],
    };
  }

  handleGetDashboardComponent({key, component}) {
    let { componentsList, componentsIndex } = this.state;
    if (!component.result) return;
    component.result.id = _.find(this.getComponentsByRole(), c => c.key === key).id;
    component.result.key = key;
    componentsIndex[key] = component.result;
    componentsList = _(componentsIndex).toArray().sortBy('id').value();
    this.setState({componentsList, componentsIndex});
	}

  handleGetDashboardSideComponent({key, component}) {
    let { componentsSideList, componentsSideIndex } = this.state;
    if (!component.result) return;
    component.result.id = _.find(this.getComponentsByRole(), c => c.key === key).id;
    component.result.key = key;
    componentsSideIndex[key] = component.result;
    componentsSideList = _(componentsSideIndex).toArray().sortBy('id').value();
    this.setState({componentsSideList, componentsSideIndex});
  }

  getComponentsByRole() {
    let { role } = this.flux.getStore('session').getCurrentUser();
    return componentsByRole[role];
  }

}

export default DashboardStore;
