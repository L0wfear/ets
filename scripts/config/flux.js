import { Flummox } from 'flummox';
import actions from '../actions';
import stores from '../stores';

export default class Flux extends Flummox {

  constructor() {
    super();

    for (const actionName in actions) {
      this.createActions(actionName, actions[actionName]);
    }

    for (const storeName in stores) {
      this.createStore(storeName, stores[storeName], this);
    }
  }

}
