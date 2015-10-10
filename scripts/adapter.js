import config from './config.js';

// @todo API INIT().then()

const POINTS_URL = config.backend ? config.backend + '/data' : '/data';
const TRACK_URL = config.backend ? config.backend + '/tracks/' : '/tracks/';
const WEATHER_URL = config.backend ? config.backend + '/weather/' : '/weather/';
const GEO_OBJECTS_URL = config.backend ? config.backend + '/geo_objects/' : '/geo_objects/';


export function getAllPoints() {
  return fetch(POINTS_URL, config.REQUEST_PARAMS).then(r => r.json());
}

function getUTCUnixTime(time) {
  return Math.round(time / 1000);
}

function init() {
  // @todo вся нужная для инициализации внешнего апи хрень здесь
}

export function getTrack(car_id, from_dt, to_dt) {

  let query = '/?from_dt=' + getUTCUnixTime(from_dt) +
    '&to_dt=' + getUTCUnixTime(to_dt) +
    '&version=2';

  console.log('track loading for', car_id);
  return fetch(TRACK_URL + car_id + query, {
    credentials: 'include'
  }).then(r => r.json())
  .then(points => points.map( (point) => {
      // wrap coords for OpenLayers
      point.coords = [point.coords[1], point.coords[0]];
      point.coords_msk = [point.coords_msk[1], point.coords_msk[0]];

      return point;
    })
  );

}

export function getWeather() {
  return fetch(WEATHER_URL).then(r => r.json());
}

export function getGeoObjectsByCoords(lat, lon, d = 5) {
  let query = '?d=' + d + '&lat=' + lat + '&lon=' + lon;
  return fetch(GEO_OBJECTS_URL + query).then(r => r.json())
}
