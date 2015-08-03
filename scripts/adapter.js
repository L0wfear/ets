import config from './config.js';

const MOSCOW_COORDS = [55.752585, 37.627284];
const POINTS_URL = config.backend ? config.backend + '/data' : '/data';
const TRACK_URL = config.backend ? config.backend + '/tracks/' : '/tracks/';
const WEATHER_URL = config.backend ? config.backend + '/weather/' : '/weather/';

export function getAllPoints() {
  return fetch(POINTS_URL, {credentials: 'include'}).then(r => r.json());
}

function getUTCUnixTime( time ){
  return Math.round( time / 1000 );
}

export function getTrack(carId, from_dt, to_dt ) {

  let now = new Date();
  let start_of_today = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate())
  );

  from_dt = !!from_dt ? from_dt : start_of_today.getTime();
  to_dt = !!to_dt ? to_dt : now.getTime();

  console.log( from_dt, to_dt);
  let query = '/?from_dt=' + getUTCUnixTime(from_dt) +
                 '&to_dt=' + getUTCUnixTime(to_dt);

  return fetch(TRACK_URL + carId + query, {credentials: 'include'}).then(r => r.json());

}

export function getWeather() {
  return fetch(WEATHER_URL).then(r => r.json());
}
