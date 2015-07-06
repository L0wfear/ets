const list = require('../okrugs.json');

const index = {};

list.forEach(item => index[item.id] = item);

export default list;
export function getOkrugById(id) {
  var r = index[id];

  if (!r) {
    console.warn(`Okrug ${id} not found`);
  }

  return index[id];
}
