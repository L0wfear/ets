import Raven from 'raven-js';

const SENTRY_KEY_TEST = '74b98d69b05c4a958c4c247eecaf74a4';
const SENTRY_KEY_STUDY = '2a7cb44593f2419e8f123f52435a3fb0';

const SENTRY_KEYS_BY_STAND = {
  'test': '74b98d69b05c4a958c4c247eecaf74a4',
  'study': '2a7cb44593f2419e8f123f52435a3fb0'
};
const SENTRY_PROJECTS_BY_STAND = {
  'test': 2,
  'study': 3
};

const SENTRY_URL = '172.17.31.73:9000';
const SENTRY_PROXY_URL = 'http://ets.tech.mos.ru/sentry';
const DSN_URL_TEST = 'http://74b98d69b05c4a958c4c247eecaf74a4@ets.tech.mos.ru/sentry/2';
const DSN_URL_STUDY = 'http://2a7cb44593f2419e8f123f52435a3fb0@ets.tech.mos.ru/sentry/3';

const URL = 'http://74b98d69b05c4a958c4c247eecaf74a4@ets.tech.mos.ru/sentry/2';

function constructCustomTransportUrl(url, project, key) {
  return `${url}/api/${project}/store/?sentry_version=7&sentry_client=raven-js%2F3.7.0&sentry_key=${key}`;
}

export function setUserContext(user) {
  Raven.setUserContext(user);
}

export function resetUserContext() {
  Raven.setUserContext();
}

function setTransport() {
  Raven.setTransport((options) => {
    const url = `${SENTRY_PROXY_URL}/api/2/store/?sentry_version=7&sentry_client=raven-js%2F3.7.0&sentry_key=${SENTRY_KEY_TEST}`;
    fetch(url, {
      method: 'post',
      body: JSON.stringify(options.data),
      mode: 'no-cors',
    });
  });
}

export function config() {
  Raven.config(URL).install();
  // setTransport();
}
