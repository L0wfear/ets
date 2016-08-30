import _ from 'lodash';
import config from './config.js';
import moment from 'moment';
import { getStartOfToday, makeUnixTime } from 'utils/dates';
import { wrapCoords, swapCoords } from 'utils/geo';
import { getServerErrorNotification } from 'utils/notifications';
import { parseFilename } from 'utils/content-disposition.js';

export function getUrl(url) {
  return config.backend ? config.backend + url : url;
}

let getOldUrl = (url) => config.backendOld ? config.backendOld + url : url;

let toFormData = (data) => {
  const formData = new FormData();
  _.mapKeys(data, (v, k) => {
    formData.append(k, v);
  });
  return formData;
};

export function toUrlWithParams(url, data) {
  let params = _.map(data, (v, k) => `${k}=${encodeURIComponent(v)}`).join('&');
  if (params && params.length) {
    return `${url}?${params}`;
  }
  return `${url}`;
};

const TRACK_URL = getOldUrl('/tracks/');
const AUTH_CHECK_URL = getUrl('/auth_check');
const DASHBOARD_URL = getUrl('/dashboard/');

function HTTPMethod(url, data = {}, method, type) {
  let body;
  data = _.clone(data);
  const token = JSON.parse(window.localStorage.getItem('ets-session'));
  let authorizationHeader = {};
  if (token && url.indexOf('plate_mission') === -1) {
    authorizationHeader['Authorization'] = `Token ${token}`;
  }

  let options = {
    method: method,
    headers: {
      'Accept': 'application/json',
      ...authorizationHeader
    },
    credentials: 'include',
  };

  if (typeof type === 'string') {
    switch (type) {
      case 'form':
        body = toFormData(data);
        break;
      case 'json':
        body = JSON.stringify(data);
        break;
    }
    options.body = body;
  } else {
    url = toUrlWithParams(url, data);
  }

  return fetch(url, options).then(r => {
    if (r.status === 401) {
      window.localStorage.clear();
      window.location.hash = '/login';
      window.location.reload();
    } else {
      return r.json().then(responseBody => {
        checkResponse(url, r, responseBody, method);
        return new Promise((res, rej) => res(responseBody));
      })
    };
  });
}

export function getJSON(url, data = {}) {
  return HTTPMethod(url, data, 'GET', undefined);
}

export function postJSON(url, data = {}, type = 'form') {
  return HTTPMethod(url, data, 'POST', type);
}

export function putJSON(url, data, type = 'form') {
  return HTTPMethod(url, data, 'PUT', type);
}

export function deleteJSON(url, data, type = 'form') {
  return HTTPMethod(url, data, 'DELETE', type);
}

export function getBlob(url, data) {
  const token = JSON.parse(window.localStorage.getItem('ets-session'));
  url = toUrlWithParams(url, data);
  return fetch(url, {
    method: 'get',
    headers: {
      'Authorization': `Token ${token}`,
      'Access-Control-Expose-Headers': 'Content-Disposition'
    }
  }).then(async (r) => {
    const fileName = parseFilename(r.headers.get('Content-Disposition'));
    const blob = await r.blob();
    return {
      blob,
      fileName
    };
  });
}

export function postBlob(url, data) {
  const token = JSON.parse(window.localStorage.getItem('ets-session'));
  return fetch(url, {
    method: 'post',
    headers: {
      'Authorization': `Token ${token}`,
      'Access-Control-Expose-Headers': 'Content-Disposition'
    },
    body: JSON.stringify(data)
  }).then(async (r) => {
    const fileName = parseFilename(r.headers.get('Content-Disposition'));
    const blob = await r.blob();
    return {
      blob,
      fileName
    };
  });
}

function checkResponse(url, response, body, method) {
  if (url.indexOf('login') === -1) {
    const usedUrl = url.slice(0, url.indexOf('?') > -1 ? url.indexOf('?') : url.length);
    let serviceName = usedUrl.split('/')[usedUrl.split('/').length-2];

    if (response.status === 500) {
      global.NOTIFICATION_SYSTEM._addNotification(getServerErrorNotification(`/${method} ${serviceName}, код ответа 500`))
    } else if (body && body.errors && body.errors.length) {
      let error = `ERROR /${method} ${usedUrl}`;
      console.error(error);

      body.errors.map( er => {
        console.error(er);
        global.NOTIFICATION_SYSTEM._addNotification(getServerErrorNotification(`/${method} ${serviceName}`))
      });
      throw new Error('Errors in response body');
    }
  }
}

export function checkToken(token) {
  return new Promise((res, rej) => {
    return getJSON(AUTH_CHECK_URL).then(r => {
      if (r.errors && r.errors.length) {
        console.log('TOKEN EXPIRED');
        rej(401);
      } else {
        console.log('TOKEN IS OK');
        res();
      }
    });
  });
}

export function logout() {
  return new Promise((res) => res());
}

// возвращает инфу для графика уровня топлива
export function getFuelData(from_dt = getStartOfToday(), to_dt = new Date().getTime(), car_id) {
  return fetch(config.backend + '/fuel/' + car_id + '/?from_dt=' + makeUnixTime(from_dt) + '&to_dt=' + makeUnixTime(to_dt))
    .then(r => r.json())
    .then(r => r.map(data => data[1]))
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
    credentials: 'include',
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

// DASHBOARD //
export function getDashboardComponent(key, payload) {
  return getJSON(`${DASHBOARD_URL}${key}/`, payload).then(component => ({component, key}));
}
