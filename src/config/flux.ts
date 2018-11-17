import { Flummox } from 'flummox';

import * as actions from 'actions';
import * as stores from 'stores';

export default class Flux extends Flummox {
  constructor() {
    super();

    for (const actionName in actions) {
      if (actionName in actions) {
        super.createActions(actionName, actions[actionName]);
      }
    }

    for (const storeName in stores) {
      if (storeName in stores) {
        super.createStore(storeName, stores[storeName], this);
      }
    }
  }
}
