import { parseFilename } from 'utils/content-disposition.js';

const SESSION_KEY = 'ets-session-test';

function urlencode(jsonObject) {
  return Object.keys(jsonObject).map(k => `${k}=${encodeURIComponent(jsonObject[k])}`).join('&');
}

function httpMethodBlob(url, data, method) {
  const token = JSON.parse(window.localStorage.getItem(SESSION_KEY));

  const options = {
    method,
    headers: {
      'Authorization': `Token ${token}`,
      'Access-Control-Expose-Headers': 'Content-Disposition',
    },
  };

  if (method === 'post') {
    options.body = JSON.stringify(data);
  } else if (method === 'get') {
    url = `${url}?${urlencode(data)}`;
  }

  return fetch(url, options)
    .then((async) (r) => {
      const fileName = parseFilename(r.headers.get('Content-Disposition'));
      const blob = await r.blob();
      return {
        blob,
        fileName,
      };
    });
}

export function getBlob(url, data) {
  return httpMethodBlob(url, data, 'get');
}

export function postBlob(url, data) {
  return httpMethodBlob(url, data, 'post');
}
