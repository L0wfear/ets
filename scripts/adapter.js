import config from './config.js';
import { getStartOfToday, makeUnixTime } from './utils/dates.js';
import { wrapCoords, swapCoords } from './utils/geo.js';

import { loadCustomers } from './customers.js';
import { loadTypes } from './types.js';
import { loadModels } from './models.js';
import { loadOkrugs } from './okrugs.js';
import { loadOwners } from './owners.js';
import { getCars } from '../mocks/krylatskoe_cars.js';
import { generateBills, removeBill, updateBill, createBill } from '../mocks/waybills.js';
import { getFuelRates as getMockFuelRates } from '../mocks/fuel_rates.js';

let getUrl = (url) => config.backend ? config.backend + url : url;

const POINTS_URL = getUrl('/data');
const TRACK_URL = getUrl('/tracks/');
const WEATHER_URL = getUrl('/weather/');
const GEO_OBJECTS_URL = getUrl('/geo_objects/');
const ROADS_ACTUAL_URL = getUrl('/roads_actual/');
const GET_ROAD_BY_ODH_URL = getUrl('/road_info/');
const CARS_INFO_URL = getUrl('/cars_info/');
const CARS_BY_OWNER_URL = getUrl('/cars_by_owner/');
const FUEL_OPERATIONS_URL = getUrl('/fuel_operations/');


export function getAllPoints() {
  return fetch(POINTS_URL, config.REQUEST_PARAMS).then(r => r.json());
}

// возвращает инфу для графика уровня топлива
export function getFuelData(from_dt = getStartOfToday(), to_dt = new Date().getTime(), car_id) {
  return fetch(config.backend + '/fuel/' + car_id + '/?from_dt=' + makeUnixTime(from_dt) + '&to_dt=' + makeUnixTime(to_dt))
    .then(r => r.json())
    .then(r => r.map(data => data[1]))
}

export function init() {
  // @todo вся нужная для инициализации внешнего апи хрень здесь
  return Promise.all([
          loadCustomers(),
          loadModels(),
          loadOwners(),
          loadOkrugs(),
          loadTypes()
        ])
    .then(getCars)
    //.then(generateBills)
}

export function getWaybills() {
  console.info('GETTING WAYBILLS');
  return generateBills();
  // return Promise.all([
  //         loadCustomers(),
  //         loadModels(),
  //         loadOwners(),
  //         loadOkrugs(),
  //         loadTypes()
  //       ])
  //       .then(getCars)
  //       .then( (result) => {
  //         console.log(result);
  //         return generateBills();
  //       })
}

export function removeWaybill(id) {
  return removeBill(id);
}

export function updateWaybill(waybill, correctionFlag) {
  return updateBill(waybill, correctionFlag);
}

export function createWaybill(waybill) {
  return createBill(waybill);
}

export function getFuelOperations() {
  return fetch(FUEL_OPERATIONS_URL).then(r => r.json());
}

export function getTrack(car_id, from_dt, to_dt) {

  let query = '/?from_dt=' + makeUnixTime(from_dt) +
    '&to_dt=' + makeUnixTime(to_dt) +
    '&version=2';

  console.log('track loading for', car_id);
  return fetch(TRACK_URL + car_id + query, {
    credentials: 'include'
  }).then(r => r.json())
    .then(points => points.map((point) => {
        // wrap coords for OpenLayers
        point.coords = swapCoords(point.coords);
        point.coords_msk = swapCoords(point.coords_msk);
        return point;
      })
    );

}

export function getCarImage(car_id, type_id, model_id) {
  return fetch(config.backend + `/car_image?model_id=${model_id}&car_id=${car_id}&type_id=${type_id}`)
        .then(r => r.json())
}

export function getWeather() {
  return fetch(WEATHER_URL).then(r => r.json());
}

// возвращает список ОДХ по координатам
export function getGeoObjectsByCoords([lat, lon], d = 5) {
  let mskQuery = '?d=' + d + '&x_msk=' + lat + '&y_msk=' + lon;
  let query = '?d=' + d + '&lat=' + lat + '&lon=' + lon;
  return fetch(GEO_OBJECTS_URL + mskQuery).then(r => r.json())
}

// возвращает список всех доступных ОДХ
export function getRoadsActual() {
  return fetch(ROADS_ACTUAL_URL).then(r => r.json());
}

// возвращает инфу по ОДХ
let ODH_CACHE = {};
export function getRoadByODHId(id) {
  if (ODH_CACHE[id] === undefined) {
    let query = '?road_id=' + id;
    return fetch(GET_ROAD_BY_ODH_URL + query).then(r => {
      ODH_CACHE[id] = r.json();
      return ODH_CACHE[id];
    });
  } else {
    return ODH_CACHE[id];
  }
}

// возвращает список всех доступных автомобилей
export function getCarsInfo() {
  return fetch(CARS_INFO_URL).then(r => r.json())
}


// TODO метод на бэкэнде
// пока возвращает промис из заглушки
export function getCarsByOwnerId(ownerId) {

  return getCars()

  let query = '?owner_id=' + ownerId;
  return fetch(CARS_BY_OWNER_URL + query).then(r => r.json())
}

export function getFuelRates(operations) {
  return getMockFuelRates(operations);
}
