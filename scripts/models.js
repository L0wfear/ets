const list = require('../models.json');

const index = {};

list.forEach(item => index[item.id] = item);

export default list;
export function getModelById(id) {
  var r = index[id];

  if (!r) {
    console.warn(`Model ${id} not found`);
  }

  return index[id];
}
