import { Flummox } from 'flummox';

import * as actions from '../actions';
import * as stores from '../stores';

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
