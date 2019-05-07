import { mapKeys } from 'lodash';
import { getServerErrorNotification } from 'utils/notifications';

import { checkInternalErrors } from 'utils/raven';
import getNotifyCheckVersion from './notify_check_version/notifyCheckVersion';

let headers = {};

try {
  document.execCommand('ClearAuthenticationCache', 'false');
} catch (e) {
  //
}

const cachingPromise = {};

export function setHeaders(requestHeaders) {
  headers = requestHeaders;
}

export function getHeaders() {
  return headers;
}

export function toFormData(data) {
  const formData = new FormData();
  mapKeys(data, (v, k) => {
    formData.append(k, v);
  });
  return formData;
}

function urlencode(jsonObject) {
  return Object.keys(jsonObject)
    .map((k) => `${k}=${encodeURIComponent(jsonObject[k])}`)
    .join('&');
}

function checkResponse(url, response, body, method) {
  const usedUrl = url.slice(
    0,
    url.indexOf('?') > -1 ? url.indexOf('?') : url.length,
  );
  const serviceName = usedUrl.split('/')[usedUrl.split('/').length - 2];

  if (response.status === 500) {
    // global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`/${method} ${serviceName}, код ответа 500`));
    const error = {
      error: body,
      error_text: new Error('Server responded with 500'),
    };
    throw error;
  } else if (response.status === 422) {
    const error = {
      error: body,
      error_text: new Error('Server responded with 422'),
      errorIsShow: true,
    };
    global.NOTIFICATION_SYSTEM.notify({
      title: 'Ошибка',
      message: 'Неправильно заполнены фильтры',
      level: 'error',
      dismissible: true,
      position: 'tr',
      autoDismiss: 0,
    });
    throw error;
  } else if (body && body.errors && body.errors.length) {
    const error = `ERROR /${method} ${usedUrl}`;
    console.error(error);

    body.errors.forEach((er) => {
      console.error(er);
      global.NOTIFICATION_SYSTEM.notify(
        getServerErrorNotification(`/${method} ${serviceName}`),
      );
    });
    const errorThrow = {
      error: body,
      error_text: new Error('Errors in response body'),
    };
    throw errorThrow;
  }
}

function httpMethod(
  urlOwn,
  dataOwn = {},
  method,
  type,
  params = {},
  otherToken,
) {
  const cacheKey = `${urlOwn}${dataOwn ? JSON.stringify(dataOwn) : ''}`;

  if (method === 'GET') {
    if (cachingPromise[cacheKey]) {
      return cachingPromise[cacheKey];
    }
  }

  let body;
  let url = urlOwn;
  const data = { ...dataOwn };
  const token = JSON.parse(
    window.localStorage.getItem(
      otherToken ? global.SESSION_KEY_ETS_TEST_BY_DEV2 : global.SESSION_KEY2,
    ) || null,
  );

  const options = {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
    credentials: 'include',
  };
  if (url.indexOf('tracks-caching') > -1) {
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
    url = `${url}?${urlencode(params)}`;
  } else {
    url = `${url}?${urlencode(data)}`;
  }

  const promise = fetch(url, options).then(async (r) => {
    delete cachingPromise[cacheKey];

    if (r.status === 401) {
      window.localStorage.clear();
      window.location.reload();
      const error_text = r.status;

      return Promise.reject({ error: r, error_text });
    }
    try {
      const responseBody = await r.json();
      try {
        checkInternalErrors(responseBody);
        checkResponse(url, r, responseBody, method);

        const servV = r.headers.get('ets-frontend-version');
        const currV = process.env.VERSION;

        if (servV) {
          const [, , minorS, someS] = servV.split('.');
          const [, , minorV, someV] = currV.split('.');
          if (minorS > minorV || (someS > someV && minorS === minorV)) {
            global.NOTIFICATION_SYSTEM.notifyWithObject({
              title: 'Вышла новая версия',
              level: 'warning',
              position: 'br',
              dismissible: false,
              autoDismiss: 0,
              uid: 'versionWarn',
              children: getNotifyCheckVersion({
                currV: process.env.VERSION,
                nextV: servV,
              }),
            });
          }
        }
      } catch (error) {
        return Promise.reject({ error, error_text: 'none' });
      }
      return Promise.resolve(responseBody, r);
    } catch (error) {
      const error_text = 'Неверный формат ответа с сервера';
      console.error(error_text, url);
      return Promise.reject({ error, error_text });
    }
  });

  if (method === 'GET') {
    cachingPromise[cacheKey] = promise;
  }

  return promise;
}

export function getJSON(url, data = {}, otherToken) {
  return httpMethod(url, data, 'GET', undefined, undefined, otherToken);
}

export function postJSON(
  url,
  data = {},
  type = 'form',
  params = {},
  otherToken,
) {
  return httpMethod(url, data, 'POST', type, params, otherToken);
}

export function putJSON(url, data, type = 'form') {
  return httpMethod(url, data, 'PUT', type);
}

export function patchJSON(url, data, type = 'form') {
  return httpMethod(url, data, 'PATCH', type);
}

export function deleteJSON(url, data, type = 'form') {
  return httpMethod(url, data, 'DELETE', type);
}
