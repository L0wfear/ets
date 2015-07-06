const list = require('../owners.json');

list.sort(function (a, b) {
  if (a.title > b.title) {
    return 1;
  }
  if (a.title < b.title) {
    return -1;
  }

  return 0;
});

const index = {};

list.forEach(item => index[item.id] = item);

export default list;
export function getOwnerById(id) {
  var r = index[id];

  if (!r) {
    console.warn(`Owner ${id} not found`);
  }

  return index[id];
}
