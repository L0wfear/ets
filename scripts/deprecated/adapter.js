// возвращает инфу по ОДХ
let ODH_CACHE = {};
export function getRoadByODHId(id) {
  if (ODH_CACHE[id] === undefined) {
    let query = '?road_id=' + id;
    return fetch(GET_ROAD_BY_ODH_URL + query, {credentials: 'include'}).then(r => {
      ODH_CACHE[id] = r.json();
      return ODH_CACHE[id];
    });
  } else {
    return ODH_CACHE[id];
  }
}
