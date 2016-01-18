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



export default class Flux extends Flummox {

  constructor(adapter) {
    super();

    const flux = this;
    const args = { flux, adapter };

    this.createActions('points', PointsActions);
    this.createActions('session', SessionActions);
    this.createActions('fuel-rates', FuelRateActions, args);
    this.createActions('waybills', WaybillsActions, args);
    this.createActions('objects', ObjectsActions, args);
    this.createActions('car', CarActions, args);
    this.createActions('employees', EmployeesActions, args);

    this.createStore('points', PointsStore, this);
    this.createStore('session', SessionStore, this);
    this.createStore('fuel-rates', FuelRatesStore, this);
    this.createStore('waybills', WaybillsStore, this);
    this.createStore('objects', ObjectsStore, this);
    this.createStore('employees', EmployeesStore, this);

  }

}
