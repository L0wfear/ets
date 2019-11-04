import { cloneDeep } from 'lodash';
import { parseFilename } from 'utils/content-disposition';
import { hasWarningNotification } from 'utils/notifications';

function urlencode(jsonObject) {
  return Object.keys(jsonObject)
    .map((k) => `${k}=${encodeURIComponent(jsonObject[k])}`)
    .join('&');
}

function httpMethodBlob(urlOwn, dataOwn, method) {
  let url = urlOwn;
  const token = JSON.parse(window.localStorage.getItem(global.SESSION_KEY));

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Token ${token}`,
      'Access-Control-Expose-Headers': 'Content-Disposition',
    },
  };
  const data = cloneDeep(dataOwn);

  if (method === 'post') {
    options.body = JSON.stringify(data);
  } else if (method === 'get') {
    url = `${url}?${urlencode(data)}`;
  }

  return fetch(url, options).then(async (r) => {
    const contentDisposition = r.headers.get('Content-Disposition');
    const defaultResult: { blob: Blob | null; fileName: string | null; } = {
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
  try {
    const ans = await httpMethodBlob(url, data, 'get');
    return ans;
  } catch (error) {
    console.warn('getBlob', error);  // eslint-disable-line
  }

  return null;
};

export function postBlob(url, data) {
  return httpMethodBlob(url, data, 'post');
}
