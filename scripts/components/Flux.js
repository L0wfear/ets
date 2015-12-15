import { Flummox } from 'flummox';
import PointsActions from '../actions/PointsActions.js';
import PointsStore from '../stores/PointsStore.js';
import LoginStore from '../stores/LoginStore.js';
import LoginActions from '../actions/LoginActions.js';


export default class Flux extends Flummox {

  constructor() {
    super();

    this.createActions('points', PointsActions);
    this.createActions('login', LoginActions);
    this.createStore('points', PointsStore, this);
    this.createStore('login', LoginStore, this);
  }

}
