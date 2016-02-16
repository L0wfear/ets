import { Store as FlummoxStore } from 'flummox';
import _ from 'lodash';

class Store extends FlummoxStore {

  constructor() {
    super();

    this.state = {

    };
  }

  makeIndex(list, field = 'id') {
    let index = {};
    console.log(field, list);
    list.forEach(item => index[item[field]] = item);
    return index;
  }

}

export default Store;
