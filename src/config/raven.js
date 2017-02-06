import Raven from 'raven-js';

const SENTRY_KEYS_BY_STAND = {
  'test': '74b98d69b05c4a958c4c247eecaf74a4',
  'study': '2a7cb44593f2419e8f123f52435a3fb0',
};
const SENTRY_PROJECTS_BY_STAND = {
  'test': 2,
  'study': 3,
};

const SENTRY_PROXY_URL = 'http://ets.tech.mos.ru/sentry';

const URL = `http://${SENTRY_KEYS_BY_STAND[process.env.STAND]}@ets.tech.mos.ru/sentry/${SENTRY_PROJECTS_BY_STAND[process.env.STAND]}`;

// export function constructCustomTransportUrl(url, project, key) {
//   return `${url}/api/${project}/store/?sentry_version=7&sentry_client=raven-js%2F3.7.0&sentry_key=${key}`;
// }

export function setUserContext(user) {
  Raven.setUserContext(user);
}

export function resetUserContext() {
  Raven.setUserContext();
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

Raven.config(URL).install();
