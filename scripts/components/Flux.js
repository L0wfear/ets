import { Flummox } from 'flummox';
import PointsActions from '../actions/PointsActions.js';
import PointsStore from '../stores/PointsStore.js';
import SessionStore from '../stores/SessionStore.js';
import SessionActions from '../actions/SessionActions.js';
import FuelRateActions from '../actions/FuelRateActions.js';
import FuelRatesStore from '../stores/FuelRatesStore.js';
import WaybillsActions from '../actions/waybillsActions.js';
import WaybillsStore from '../stores/WaybillsStore.js';


export default class Flux extends Flummox {

  constructor(adapter) {
    super();

    const flux = this;
    const args = { flux, adapter };

    this.createActions('points', PointsActions);
    this.createActions('session', SessionActions);
    this.createActions('fuel-rates', FuelRateActions, args);
    this.createActions('waybills', WaybillsActions, args);

    this.createStore('points', PointsStore, this);
    this.createStore('session', SessionStore, this);
    this.createStore('fuel-rates', FuelRatesStore, this);
    this.createStore('waybills', WaybillsStore, this);

  }

}
