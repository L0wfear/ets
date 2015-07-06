import config from './config.js';

const MOSCOW_COORDS = [55.752585, 37.627284];
const POINTS_URL = config.backend ? config.backend + '/data' : '/data';
const TRACK_URL = config.backend ? config.backend + '/tracks/' : '/tracks/';
const WEATHER_URL = config.backend ? config.backend + '/weather/' : '/weather/';


export function getAllPoints() {

  return fetch(POINTS_URL).then(r => r.json());

}

export function getTrack(carId) {

  return fetch(TRACK_URL + carId).then(r => r.json());

}

export function getWeather() {
  return fetch(WEATHER_URL).then(r => r.json());
}
