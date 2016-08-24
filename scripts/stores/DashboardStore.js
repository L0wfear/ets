import { Store } from 'flummox';
import _ from 'lodash';

const dashboardComponents = [
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
    id: 4,
    key: 'odh_not_covered_by_missions_of_current_shift',
    itemsTitle: 'Список одх'
  },
  {
    id: 5,
    key: 'odh_not_covered_by_routes',
  },
  {
    id: 8,
    key: 'car_in_work_overall',
  },
  {
    id: 9,
    key: 'faxogramms',
    itemsTitle: 'Расшифровка факсограммы'
  },
  {
    id: 12,
    key: 'current_duty_missions',
    itemsTitle: 'Карточка наряд-задания'
  },
  {
    id: 19,
    key: 'waybill_draft',
    itemsTitle: 'Рег. номер ТС'
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
  }
];

const commonComponents = [
  {
    id: 1,
    key: 'current_missions',
    itemsTitle: 'Карточка задания'
  },
  {
    id: 9,
    key: 'faxogramms',
    itemsTitle: 'Расшифровка факсограммы'
  }
];

const componentsByRole = {
  master: [...commonComponents,
    {
      id: 2,
      key: 'future_missions',
    },
    {
      id: 4,
      key: 'odh_not_covered_by_missions_of_current_shift',
      itemsTitle: 'Список одх'
    },
    {
      id: 5,
      key: 'odh_not_covered_by_routes',
    },
    {
      id: 8,
      key: 'car_in_work_overall',
    },
    {
      id: 12,
      key: 'current_duty_missions',
      itemsTitle: 'Карточка наряд-задания'
    }
  ],
  dispatcher: [...commonComponents,
    {
      id: 19,
      key: 'waybill_draft',
      itemsTitle: 'Рег. номер ТС'
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
    }
  ]
}

export default class DashboardStore extends Store {

  static get initialState() {
    return {
      componentsIndex: {},
      componentsSideIndex: {},
      componentsList: [],
      componentsSideList: []
    };
  }

  constructor(flux) {
    super();
    this.flux = flux;

    const dashboardActions = flux.getActions('dashboard');
    this.register(dashboardActions.getDashboardComponent, this.handleGetDashboardComponent);

    this.state = _.cloneDeep(DashboardStore.initialState);
  }

  handleGetDashboardComponent({key, component}) {
    let { componentsList, componentsIndex } = this.state;
    if (!component.result) return;
    let componentSchema = _.find(this.getComponentsByPermissions(), c => c.key === key);
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

  getComponentsByPermissions() {
    let { permissions = [] } = this.flux.getStore('session').getCurrentUser();
    const dashboardPermissions = permissions
      .map(p => p.toLowerCase())
      .filter(p => p.indexOf('dashboard') + 1)
      .map(p => p.replace('dashboard.', ''));
    return dashboardComponents.filter(c => dashboardPermissions.indexOf(c.key) + 1);
  }

  resetState() {
    this.setState(_.cloneDeep(DashboardStore.initialState));
  }

}
