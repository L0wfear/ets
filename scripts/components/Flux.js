import { Flummox } from 'flummox';
import PointsActions from '../actions/PointsActions.js';
import PointsStore from '../stores/PointsStore.js';
import LoginStore from '../stores/LoginStore.js';
import LoginActions from '../actions/LoginActions.js';
import FuelRateActions from '../actions/FuelRateActions.js';
import FuelRatesStore from '../stores/FuelRatesStore.js';


export default class Flux extends Flummox {

  constructor(adapter) {
    super();

    const flux = this;
    const args = { flux, adapter };

    this.createActions('points', PointsActions);
    this.createActions('login', LoginActions);
    this.createActions('fuel-rates', FuelRateActions, args);
    //this.createActions();
    this.createStore('points', PointsStore, this);
    this.createStore('login', LoginStore, this);
    this.createStore('fuel-rates', FuelRatesStore, this);
  }

}
