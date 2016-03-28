import { Store } from 'flummox';
import _ from 'lodash';


//`${key}=${c.filter[key].join(`&${key}=`)}`

const commonComponents = [
  {
    id: 1,
    key: 'current_missions',
    itemsTitle: 'Карточка задания'
  },
  {
    id: 2,
    key: 'future_missions',
  },
  {
    id: 3,
    key: 'count_traveled_routes_by_current_operations',
    itemsTitle: 'Расшифровка факсограммы'
  },
  {
    id: 6,
    key: 'count_offline_cars',
  },
  {
    id: 7,
    key: 'car_in_work_on_current_missions',
    itemsTitle: 'Гос. номер ТС'
  },
  {
    id: 9,
    key: 'faxogramms',
    itemsTitle: 'Расшифровка факсограммы'
  },
  {
    id: 13,
    key: 'estimated_time',
  }
]

const componentsByRole = {
  master: [...commonComponents.filter(c => [3, 6, 7, 13].indexOf(c.id) === -1),
    {
      id: 4,
      key: 'odh_not_covered_by_missions_of_current_shift',
      itemsTitle: 'Список одх'
    },
    {
      id: 5,
      key: 'odh_not_covered_by_routes',
    },
    { //временно не показываем
      id: 8,
      key: 'car_in_work_overall',
      //side: true,
    },
    {
      id: 11,
      key: 'daily_missions_percent',
      side: true,
    },
    // {
    //   id: 10,
    //   key: 'count_waybill_closed',
    //   side: true,
    //   filter: {
    //     status: ['closed'],
    //     date_create: [moment().format('YYYY-MM-DD')],
    //   }
    // },
    // {
    //   id: 13,
    //   key: 'estimated_time'
    // }
  ],
  dispatcher: [//...commonComponents,
    // {
    //   id: 15,
    //   key: 'count_assigned_routes'
    // },
    // {
    //   id: 16,
    //   key: 'released_waybill',
    //   side: true,
    // },
    // {
    //   id: 18,
    //   key: 'count_closed_waybill_by_current_operations'
    // }
    {
      id: 19,
      key: 'waybill_draft',
      itemsTitle: 'Гос. номер ТС'
    },
    {
      id: 20,
      key: 'waybill_active',
      itemsTitle: 'Информация о ПЛ'
    },
    {
      id: 21,
      key: 'waybill_closed',
      itemsTitle: 'Информация о ПЛ'
    },
    {
      id: 22,
      key: 'current_missions',
      itemsTitle: 'Карточка задания'
    },
  ]
}

const initialState = {
  componentsIndex: {},
  componentsSideIndex: {},
  componentsList: [],
  componentsSideList: [],
};

class DashboardStore extends Store {

  constructor(flux) {
    super();
    this.flux = flux;

    const dashboardActions = flux.getActions('dashboard');
    this.register(dashboardActions.getDashboardComponent, this.handleGetDashboardComponent);
    this.register(dashboardActions.getDashboardSideComponent, this.handleGetDashboardSideComponent);

    this.state = _.cloneDeep(initialState);
  }

  handleGetDashboardComponent({key, component}) {
    let { componentsList, componentsIndex } = this.state;
    if (!component.result) return;
    let componentSchema = _.find(this.getComponentsByRole(), c => c.key === key);
    if (!componentSchema) return;
    component.result.id = componentSchema.id;
    component.result.key = key;
    if (componentSchema.itemsTitle) {
      component.result.itemsTitle = componentSchema.itemsTitle;
    }
    componentsIndex[key] = component.result;
    componentsList = _(componentsIndex).toArray().sortBy('id').value();
    this.setState({componentsList, componentsIndex});
	}

  handleGetDashboardSideComponent({key, component}) {
    let { componentsSideList, componentsSideIndex } = this.state;
    if (!component.result || typeof component.result === 'string') return;
    let componentSchema = _.find(this.getComponentsByRole(), c => c.key === key);
    if (!componentSchema) return;
    component.result.id = componentSchema.id;
    component.result.key = key;
    componentsSideIndex[key] = component.result;
    componentsSideList = _(componentsSideIndex).toArray().sortBy('id').value();
    this.setState({componentsSideList, componentsSideIndex});
  }

  getComponentsByRole() {
    let { role } = this.flux.getStore('session').getCurrentUser();
    return componentsByRole[role];
  }

  resetState() {
    this.setState(_.cloneDeep(initialState));
  }

}

export default DashboardStore;
