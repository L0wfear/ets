
import config from './config.js';
const CUSTOMERS_URL = config.backend ? config.backend + '/customers' : '/customers';

const list = [];
const index = {};

function makeIndex() {
  list.forEach(item => index[item.id] = item);
}

function replaceList(newList) {
  list.length = 0;

  for (let o of newList) {
    list.push(o)
  }

}
function normalizeArray(objOrArray) {

  if (Array.isArray(objOrArray)) {
    return objOrArray;
  }

  return Object.keys(objOrArray)
               .map(key => objOrArray[key]);

}

export default list;

export function getCustomerById(id) {
  var r = index[id];

  if (!r) {
    console.warn(`Customer ${id} not found`);
  }

  return index[id];
}

export function loadCustomers() {
  return fetch(CUSTOMERS_URL)
    .then(r => r.json())
    .then(normalizeArray)
    .then(replaceList)
    .then(makeIndex);
}
