import Raven from 'raven-js';

const ACTIVE = process.env.NODE_ENV === 'production';
// test // http://79c9fa1b267c454ca680692b9d2d4d25@172.17.31.73:9000/7
// study // http://bde014009c3f4c80bd3e840296fd94c9@172.17.31.73:9000/8
const SENTRY_KEYS_BY_STAND = {
  'test': '79c9fa1b267c454ca680692b9d2d4d25', // http://172.17.31.73:9000/sentry/ets-frontend-dev/
  'study': 'bde014009c3f4c80bd3e840296fd94c9', // http://172.17.31.73:9000/sentry/ets-frontend-prod/
};
const SENTRY_PROJECTS_BY_STAND = {
  'test': 7,
  'study': 8,
};

const SENTRY_PROXY_URL = 'http://ets.tech.mos.ru/sentry';

const URL = `http://${SENTRY_KEYS_BY_STAND[process.env.STAND]}@ets.tech.mos.ru/sentry/${SENTRY_PROJECTS_BY_STAND[process.env.STAND]}`;

// export function constructCustomTransportUrl(url, project, key) {
//   return `${url}/api/${project}/store/?sentry_version=7&sentry_client=raven-js%2F3.7.0&sentry_key=${key}`;
// }

export function setUserContext(user) {
  if (ACTIVE) {
    Raven.setUserContext(user);
  }
}

export function resetUserContext() {
  if (ACTIVE) {
    Raven.setUserContext();
  }
}

export function setTransport() {
  Raven.setTransport((options) => {
    const url = `${SENTRY_PROXY_URL}/api/2/store/?sentry_version=7&sentry_client=raven-js%2F3.7.0&sentry_key=${SENTRY_KEYS_BY_STAND[process.env.STAND]}`;
    fetch(url, {
      method: 'post',
      body: JSON.stringify(options.data),
      mode: 'no-cors',
    });
  });
}

if (ACTIVE) {
  Raven.config(URL).install();
}
