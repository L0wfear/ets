import _ from 'lodash';
import { getServerErrorNotification } from 'utils/notifications';
import { parseFilename } from 'utils/content-disposition.js';

export function toFormData(data) {
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
    url = toUrlWithParams(url, data);
  }

  return fetch(url, options).then(r => {
    if (r.status === 401) {
      window.localStorage.clear();
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

function HTTPMethodBlob(url, data, method) {
  const token = JSON.parse(window.localStorage.getItem('ets-session'));

  const options = {
    method,
    headers: {
      'Authorization': `Token ${token}`,
      'Access-Control-Expose-Headers': 'Content-Disposition'
    }
  };

  if (method === 'post') {
    options.body = JSON.stringify(data);
  } else if (method === 'get') {
    url = toUrlWithParams(url, data);
  }

  return fetch(url, options)
    .then(async (r) => {
      const fileName = parseFilename(r.headers.get('Content-Disposition'));
      const blob = await r.blob();
      return {
        blob,
        fileName
      };
    });
}

export function getBlob(url, data) {
  return HTTPMethodBlob(url, data, 'get');
}

export function postBlob(url, data) {
  return HTTPMethodBlob(url, data, 'post');
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
