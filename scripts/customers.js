const list = require('../customers.json');

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
