import config from './config.js';

const MOSCOW_COORDS = [55.752585, 37.627284];
const POINTS_URL = config.backend ? config.backend + '/data' : '/data';
const TRACK_URL = config.backend ? config.backend + '/tracks/' : '/tracks/';
const WEATHER_URL = config.backend ? config.backend + '/weather/' : '/weather/';
const POINT_INFO_URL = config.backend ? config.backend + '/point_info/' : '/point_info/';
const GEO_OBJECTS_URL = config.backend ? config.backend + '/geo_objects/' : '/geo_objects/';


export function getAllPoints() {
  return fetch(POINTS_URL, config.REQUEST_PARAMS).then(r => r.json());
}

function getUTCUnixTime( time ){
  return Math.round( time / 1000 );
}

export function getTrack(carId, from_dt, to_dt ) {

  let query = '/?from_dt=' + getUTCUnixTime(from_dt) +
                 '&to_dt=' + getUTCUnixTime(to_dt) +
                 '&version=2';

  console.log( 'track loading for', carId);
  return fetch(TRACK_URL + carId + query, {credentials: 'include'}).then(r => r.json());

}

export function getWeather() {
  return fetch(WEATHER_URL).then(r => r.json());
}

export function getGeoObjectsByCoords( lat, lon, d = 5){
  let query = '?d='+d+'&lat='+lat+'&lon='+lon;
  return fetch(GEO_OBJECTS_URL+query).then( r => r.json())
}
