import _ from 'lodash';
import { getServerErrorNotification } from 'utils/notifications';

export function toFormData(data) {
  const formData = new FormData();
  _.mapKeys(data, (v, k) => {
    formData.append(k, v);
  });
  return formData;
}

function urlencode(jsonObject) {
  return Object.keys(jsonObject).map(k => `${k}=${encodeURIComponent(jsonObject[k])}`).join('&');
}

function checkResponse(url, response, body, method) {
  const usedUrl = url.slice(0, url.indexOf('?') > -1 ? url.indexOf('?') : url.length);
  const serviceName = usedUrl.split('/')[usedUrl.split('/').length - 2];

  if (response.status === 500) {
    global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`/${method} ${serviceName}, код ответа 500`));
  } else if (body && body.errors && body.errors.length) {
    const error = `ERROR /${method} ${usedUrl}`;
    console.error(error);

    body.errors.forEach((er) => {
      console.error(er);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`/${method} ${serviceName}`));
    });
    throw new Error('Errors in response body');
  }
}

function httpMethod(url, data = {}, method, type) {
  let body;
  data = { ...data };
  const token = JSON.parse(window.localStorage.getItem('ets-session'));

  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Token ${token}`,
    },
    credentials: 'include',
  };
  if (url.indexOf('city-dashboard') > -1) {
    delete options.headers;
  }

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
    url = `${url}?${urlencode(data)}`;
  }

  return fetch(url, options).then((r) => {
    if (r.status === 401) {
      window.localStorage.clear();
      window.location.reload();
      // return new Promise((res, rej) => rej(r.status));
    } else {
      return r.json().then((responseBody) => {
        checkResponse(url, r, responseBody, method);
        return new Promise(res => res(responseBody));
      });
    }
  });
}

export function getJSON(url, data = {}) {
  return httpMethod(url, data, 'GET', undefined);
}

export function postJSON(url, data = {}, type = 'form') {
  return httpMethod(url, data, 'POST', type);
}

export function putJSON(url, data, type = 'form') {
  return httpMethod(url, data, 'PUT', type);
}

export function deleteJSON(url, data, type = 'form') {
  return httpMethod(url, data, 'DELETE', type);
}
