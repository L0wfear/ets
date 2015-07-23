const list = require('../types.json');

console.log('types: ', list);

const index = {};

list.forEach(item => index[item.id] = item);

export default list;
export function getTypeById(id) {
  var r = index[id];
  if (!r) {
    //console.warn(`Type ${id} not found`);
    r = getTypeById(5);
  }
  return r;
}
