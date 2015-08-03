
import config from './config.js';
const OWNERS_URL = config.backend ? config.backend + '/owners' : '/owners';

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

export function getOwnerById(id) {
  var r = index[id];

  if (!r) {
    //console.warn(`Owner ${id} not found`);
    r = index[0];
  }

  return r;
}

export function loadOwners() {
  return fetch(OWNERS_URL, {credentials: 'include'})
    .then(r => r.json())
    .then(normalizeArray)
    .then(replaceList)
    .then(makeIndex);
}
