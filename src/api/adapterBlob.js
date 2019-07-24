import { parseFilename } from 'utils/content-disposition';
import { hasWarningNotification } from 'utils/notifications';

function urlencode(jsonObject) {
  return Object.keys(jsonObject)
    .map((k) => `${k}=${encodeURIComponent(jsonObject[k])}`)
    .join('&');
}

function httpMethodBlob(urlOwn, data, method) {
  let url = urlOwn;
  const token = JSON.parse(window.localStorage.getItem(global.SESSION_KEY));

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

  return fetch(url, options).then(async (r) => {
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

export const getBlob = async (url, data) => {
  let ans = '';

  try {
    ans = await httpMethodBlob(url, data, 'get');
  } catch (error) {
    console.warn('getBlob', error);
  }

  return ans;
};

export function postBlob(url, data) {
  return httpMethodBlob(url, data, 'post');
}
