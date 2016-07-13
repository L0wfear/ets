import { Flummox } from 'flummox';
import PointsActions from '../actions/PointsActions.js';
import PointsStore from '../stores/PointsStore.js';
import SessionStore from '../stores/SessionStore.js';
import SessionActions from '../actions/SessionActions.js';
import FuelRateActions from '../actions/FuelRateActions.js';
import FuelRatesStore from '../stores/FuelRatesStore.js';
import WaybillsActions from '../actions/WaybillsActions.js';
import WaybillsStore from '../stores/WaybillsStore.js';
import ObjectsActions from '../actions/ObjectsActions.js';
import ObjectsStore from '../stores/ObjectsStore.js';
import CarActions from '../actions/CarActions.js';
import EmployeesStore from '../stores/EmployeeStore.js';
import EmployeesActions from '../actions/EmployeesActions.js';
import MissionsActions from '../actions/MissionsActions.js';
import MissionsStore from '../stores/MissionsStore.js';
import LoadingStore from '../stores/LoadingStore.js';
import NotificationsStore from '../stores/NotificationsStore.js';
import RoutesActions from '../actions/RoutesActions.js';
import RoutesStore from '../stores/RoutesStore.js';
import DashboardActions from '../actions/DashboardActions.js';
import DashboardStore from '../stores/DashboardStore.js';
import TechnicalOperationsActions from '../actions/TechnicalOperationsActions.js';
import CompanyStructureActions from '../actions/CompanyStructureActions.js';
import ReportsActions from '../actions/ReportsActions.js';
import ReportsStore from '../stores/ReportsStore.js';
import SettingsStore from '../stores/SettingsStore.js';
import SettingsActions from '../actions/SettingsActions.js';



export default class Flux extends Flummox {

  constructor() {
    super();

    const flux = this;
    const args = { flux };

    this.createActions('points', PointsActions);
    this.createActions('session', SessionActions);
    this.createActions('fuel-rates', FuelRateActions, args);
    this.createActions('waybills', WaybillsActions, args);
    this.createActions('objects', ObjectsActions, args);
    this.createActions('car', CarActions, args);
    this.createActions('employees', EmployeesActions, args);
    this.createActions('missions', MissionsActions, args);
    this.createActions('routes', RoutesActions, args);
    this.createActions('dashboard', DashboardActions, args);
    this.createActions('technical_operation', TechnicalOperationsActions, args);
    this.createActions('company-structure', CompanyStructureActions, args);
    this.createActions('reports', ReportsActions, args);
    this.createActions('settings', SettingsActions, args);


    this.createStore('points', PointsStore, this);
    this.createStore('session', SessionStore, this);
    this.createStore('fuel-rates', FuelRatesStore, this);
    this.createStore('waybills', WaybillsStore, this);
    this.createStore('objects', ObjectsStore, this);
    this.createStore('employees', EmployeesStore, this);
    this.createStore('missions', MissionsStore, this);
    this.createStore('loading', LoadingStore, this);
    this.createStore('notifications', NotificationsStore, this);
    this.createStore('routes', RoutesStore, this);
    this.createStore('dashboard', DashboardStore, this);
    this.createStore('reports', ReportsStore, this);
    this.createStore('settings', SettingsStore, this);

  }

}
