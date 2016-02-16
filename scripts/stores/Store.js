import { Store as FlummoxStore } from 'flummox';
import _ from 'lodash';

class Store extends FlummoxStore {

  constructor() {
    super();

    this.state = {

    };
  }

  makeIndex(list, field) {
    let index = {};
    list.forEach(item => index[item.id] = item);
    return index;
  }

}

export default Store;
