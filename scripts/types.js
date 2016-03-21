import {TypesService} from 'api/Services';

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

export function getTypeById(id) {
  return index[id] === undefined ? index[0] || {} : index[id];
}

export function loadTypes(types) {
  return TypesService.get()
    .then(r => {
      if (typeof r.json === 'function') {
        return r.json();
      }
      return r;
     })
    .then(normalizeArray)
    .then(replaceList)
    .then(makeIndex);
}

export function getTypes() {
  return TypesService.get()
    .then(r => {
      if (typeof r.json === 'function') {
        return r.json();
      }
      return r;
     })
    .then(normalizeArray);
}
