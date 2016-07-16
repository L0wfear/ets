import { Flummox } from 'flummox';
import actions from '../actions';
import stores from '../stores';

export default class Flux extends Flummox {

  constructor() {
    super();

    const flux = this;

    for (let actionName in actions) {
      this.createActions(actionName, actions[actionName]);
    }

    for (let storeName in stores) {
      this.createStore(storeName, stores[storeName], this);
    }

  }

}
