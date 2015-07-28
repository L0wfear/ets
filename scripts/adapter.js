import config from './config.js';

const MOSCOW_COORDS = [55.752585, 37.627284];
const POINTS_URL = config.backend ? config.backend + '/data' : '/data';
const TRACK_URL = config.backend ? config.backend + '/tracks/' : '/tracks/';
const WEATHER_URL = config.backend ? config.backend + '/weather/' : '/weather/';


export function getAllPoints() {

  return fetch(POINTS_URL).then(r => r.json());

}

function getUTCUnixTime( time ){
  return Math.round( time / 1000 );
}

export function getTrack(carId) {

  let now = new Date();
  let start_of_today = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate())
  );

  let query = '/?from_dt=' + getUTCUnixTime(start_of_today) +
                 '&to_dt=' + getUTCUnixTime(now.getTime());

  return fetch(TRACK_URL + carId + query).then(r => r.json());

}

export function getWeather() {
  return fetch(WEATHER_URL).then(r => r.json());
}
