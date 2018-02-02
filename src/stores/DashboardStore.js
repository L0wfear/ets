import { Store } from 'flummox';
import _ from 'lodash';

const dashboardComponents = [
  {
    id: 1,
    key: 'current_missions',
    itemsTitle: 'Карточка задания',
  },
  {
    id: 2,
    key: 'future_missions',
  },
  {
    id: 4,
    key: 'odh_not_covered_by_missions_of_current_shift',
    itemsTitle: 'Список одх',
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
    itemsTitle: 'Расшифровка факсограммы',
  },
  {
    id: 12,
    key: 'current_duty_missions',
    itemsTitle: 'Карточка наряд-задания',
  },
  {
    id: 19,
    key: 'waybill_draft',
    itemsTitle: 'Рег. номер ТС',
  },
  {
    id: 20,
    key: 'waybill_in_progress',
    itemsTitle: 'Информация о ПЛ',
  },
  {
    id: 21,
    key: 'waybill_completed',
    itemsTitle: 'Информация о ПЛ',
  },
  {
    id: 22,
    key: 'waybill_closed',
    itemsTitle: 'Информация о ПЛ',
  },
  // {
  //   id: 23,
  //   key: 'external_applications',
  //   itemsTitle: 'Заявки из внешних Систем',
  // },
];

const dashboardComponentsKeyList = dashboardComponents.reduce((arr, obj) => [...arr, obj.key], []);

export default class DashboardStore extends Store {

  static get initialState() {
    return {
      componentsIndex: {},
      componentsSideIndex: {},
      componentsList: [],
      componentsSideList: [],
    };
  }

  constructor(flux) {
    super();
    this.flux = flux;

    const dashboardActions = flux.getActions('dashboard');
    this.register(dashboardActions.getDashboardComponent, this.handleGetDashboardComponent);

    this.state = _.cloneDeep(DashboardStore.initialState);
  }

  handleGetDashboardComponent({ key, component }) {
    const { componentsIndex } = this.state;
    let { componentsList } = this.state;
    if (!component.result) return;
    const componentSchema = _.find(this.getComponentsByPermissionsAll(), c => c.key === key);
    if (!componentSchema) return;
    component.result.id = componentSchema.id;
    component.result.key = key;
    if (componentSchema.itemsTitle) {
      component.result.itemsTitle = componentSchema.itemsTitle;
    }
    componentsIndex[key] = component.result;
    componentsList = _(componentsIndex).toArray().sortBy('id').value();
    this.setState({ componentsList, componentsIndex });
  }

  getComponentsByPermissionsAll() {
    return this.getComponentsByPermissions(dashboardComponentsKeyList, []);
  }

  getComponentsByPermissions(goodUpdateKeyList = dashboardComponentsKeyList, reduntUpdateList = ['current_missions']) {
    const { permissions = [] } = this.flux.getStore('session').getCurrentUser();

    const dashboardPermissions = permissions
      .map(p => p.toLowerCase())
      .filter(p => p.indexOf('dashboard') + 1)
      .map(p => p.replace('dashboard.', ''))
      .concat(['external_applications'])
      .filter(p => !reduntUpdateList.includes(p))
      .filter(p => goodUpdateKeyList.includes(p));

    return dashboardComponents.filter(c => dashboardPermissions.includes(c.key));
  }
  resetState() {
    this.setState(_.cloneDeep(DashboardStore.initialState));
  }

}
