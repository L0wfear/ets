import { parseFilename } from 'utils/content-disposition.js';
import { hasWarningNotification } from 'utils/notifications';

function urlencode(jsonObject) {
  return Object.keys(jsonObject).map(k => `${k}=${encodeURIComponent(jsonObject[k])}`).join('&');
}

function httpMethodBlob(url, data, method) {
  const token = JSON.parse(window.localStorage.getItem(global.SESSION_KEY2));

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
    .then(async (r) => {
      const contentDisposition = r.headers.get('Content-Disposition');
      const defaultResult = {
        blob: null,
        fileName: null,
      };

      if (contentDisposition === null) {
        const response = await r.json();
        hasWarningNotification(response);
        return defaultResult;
      }

      const blob = await r.blob();
      const fileName = parseFilename(contentDisposition);

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
