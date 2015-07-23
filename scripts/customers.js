//const list = require('../customers.json');

import config from './config.js';
const CUSTOMERS_URL = config.backend ? config.backend + '/customers' : '/customers';

var list = [];
fetch(CUSTOMERS_URL).then(r => r.json()).then(data => {list = data});

const index = {};

list.forEach(item => index[item.id] = item);

export default list;
export function getCustomerById(id) {
  var r = index[id];

  if (!r) {
    console.warn(`Customer ${id} not found`);
  }

  return index[id];
}
