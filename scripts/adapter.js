import _ from 'lodash';
import config from './config.js';
import moment from 'moment';
import { getStartOfToday, makeUnixTime } from './utils/dates.js';
import { wrapCoords, swapCoords } from './utils/geo.js';
import { RouteService } from './api/Services.js';
import { loadTypes } from './types.js';

export function getUrl(url) {
  return config.backend ? config.backend + url : url
}
let getOldUrl = (url) => config.backendOld ? config.backendOld + url : url;

let toFormData = (data) => {
  const formData = new FormData();
  _.mapKeys(data, (v, k) => {
    formData.append(k, v);
  });
  return formData;
};

let toUrlWithParams = (url, data) => {
  let params = '?';
  _.mapKeys(data, (v, k) => {
    if (_.isArray(v)) {
      if (k === 'taxes') {
        const taxes = {'taxes':v};
        params += `data=${encodeURIComponent(JSON.stringify(taxes))}&`
      }

    } else {
      params += `${k}=${encodeURIComponent(v)}&`;
    }
  });
  return `${url}${params}`;
};

let paramsToBody = (data) => {
  let params = '';
  _.mapKeys(data, (v, k) => {
      params += `${k}=${encodeURIComponent(v)}&`;
  });
  return params.slice(0, -1);
};

const POINTS_URL = getUrl('/data');
const TRACK_URL = getOldUrl('/tracks/');
const WEATHER_URL = getUrl('/weather/');
const GEO_OBJECTS_URL = getUrl('/geo_objects/');
const FUEL_OPERATIONS_URL = getUrl('/fuel_operations/');
const FUEL_CONSUMPTION_RATE_URL = getUrl('/fuel_consumption_rates/');
const LOGIN_URL = getUrl('/auth/');
const AUTH_CHECK_URL = getUrl('/auth_check');
const ODHS_URL = getUrl('/odh/');
const MISSIONS_CREATION_URL = getUrl('/create_missions_from_mission_templates/');
const ROUTE_URL = getUrl('/route/');
const DASHBOARD_URL = getUrl('/dashboard/');

export function getJSON(url, data = {}) {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;
  }
  url = toUrlWithParams(url, data);

  const options = {
    method: 'get',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  };

  return fetch(url, options).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'GET');
      return new Promise((res, rej) => res(body));
    });
  });
}

export function postJSON(url, data = {}, type = 'form') {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;
  }
  let body;
  type = 'form';
  switch (type) {
    case 'form':
      // url += '?token=' + token;
      // delete data.token;
      body = toFormData(data);
      break;
    case 'form_with_token':
      body = paramsToBody(data);
      break;
    case 'json':
      body = JSON.stringify(data);
      break;
    case 'params':
      body = "";
      url = toUrlWithParams(url, data);
      break;
  }

  const options = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: body
  };

  return fetch(url, options).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'POST');
      return new Promise((res, rej) => res(body));
    });
  });
}

export function putJSON(url, data, type = 'form') {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;//url += `?token=${token}`;
  }
  let body;
  switch (type) {
    case 'form':
      url += '?token=' + token;
      delete data.token;
      body = toFormData(data);
      break;
    case 'json':
      body = JSON.stringify(data);
      break;
    case 'params':
      body = "";
      url = toUrlWithParams(url, data);
      break;
  }

  const options = {
    method: 'put',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: body,
  };

  return fetch(url, options).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'PUT');
      return new Promise((res, rej) => res(body));
    });
  });
}

export function deleteJSON(url, data, type = 'form') {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;
  }
  let body;
  type = 'form';
  switch (type) {
    case 'form':
      url += '?token=' + token;
      delete data.token;
      body = toFormData(data);
      break
    case 'json':
      body = JSON.stringify(data);
      break;
    case 'params':
      body = "";
      url = toUrlWithParams(url, data);
      break;
  }

  const options = {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: body,
  };

  return fetch(url, options).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'DELETE');
      return new Promise((res, rej) => res(body));
    });
  });
}

function checkResponse(url, response, body, method) {
  if (url.indexOf('login') === -1) {
    const { flux } = window.__ETS_CONTAINER__;

    if (body && body.errors && body.errors.length) {
      const usedUrl = url.slice(0, url.indexOf('?') > -1 ? url.indexOf('?') : url.length);
      console.error(`ERROR /${method} ${usedUrl}`);
      body.errors.map( er => {
        console.error(er);
      })
    }

    if (response.status === 401) {
      console.warn('USER IS NOT AUTHORIZED');
      flux.getActions('session').logout({reason: 'no auth'});
    }
  }
}

export function checkToken(token) {
  return new Promise((res, rej) => {
    return getJSON(AUTH_CHECK_URL).then(r => {
      if (r.errors.length) {
        console.log('TOKEN EXPIRED');
        rej(401);
      } else {
        console.log('TOKEN IS OK');
        res();
      }
    });
  });
}

export function login(user) {
  return fetch(LOGIN_URL, {method: 'POST', body: toFormData(user)}).then(r => r.json());
}

export function logout() {
  return new Promise((res) => res());
}

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
  console.warn('INIT');
  // @todo вся нужная для инициализации внешнего апи хрень здесь
  return Promise.all([
          loadTypes()
        ])
}

export function getFuelOperations() {
  return fetch(FUEL_OPERATIONS_URL).then(r => r.json());
}

export function getFuelRatesByCarModel(car_model_id) {
  return getJSON(FUEL_CONSUMPTION_RATE_URL, { car_model_id });
}

export function getTrack(car_id, from_dt, to_dt) {

  if (typeof from_dt === 'string') {
    from_dt = moment(from_dt).toDate();
  }

  if (typeof to_dt === 'string') {
    to_dt = moment(to_dt).toDate();
  }

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

export function getODHs() {
  return getJSON(ODHS_URL);
}

export function createMissions(payload) {
  return postJSON(MISSIONS_CREATION_URL, payload, 'form_with_token').then( () => {
    return getMissions();
  });
}

// ROUTES

export function createRoute(route) {
  return postJSON(ROUTE_URL, route, 'form').then((createdRoute) => RouteService.get().then(routes => {
    return {createdRoute, routes};
  }));
}

// DASHBOARD //

export function getDashboardComponent(key) {
  let payload = key === 'faxogramms' ? {status: 2, date: moment().format('YYYY-MM-DDTHH:mm:ss')} : {};
  return getJSON(`${DASHBOARD_URL}${key}/`, payload).then(component => ({component, key}));
}
