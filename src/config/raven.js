import Raven from 'raven-js';

const ACTIVE = process.env.NODE_ENV === 'production';
// stage // http://79c9fa1b267c454ca680692b9d2d4d25@172.17.31.73:9000/7
// prod // http://bde014009c3f4c80bd3e840296fd94c9@172.17.31.73:9000/8
// dev // http://6abe791fb4544929a9845cebb7a194df@46.161.0.203/7
const SENTRY_KEYS_BY_STAND = {
  'stage': '79c9fa1b267c454ca680692b9d2d4d25', // http://172.17.31.73:9000/sentry/ets-frontend-dev/
  'prod': 'bde014009c3f4c80bd3e840296fd94c9', // http://172.17.31.73:9000/sentry/ets-frontend-prod/
  'dev': 'aa6710a11a65405bbad39136e062c3af',
};
const SENTRY_PROJECTS_BY_STAND = {
  'stage': 7,
  'prod': 8,
  'dev': 12,
};
const SENTRY_HOST_BY_STAND = {
  'stage': 'ets.tech.mos.ru/sentry',
  'prod': 'ets.tech.mos.ru/sentry',
  'dev': '46.161.0.203',
};

const URL = `http://${SENTRY_KEYS_BY_STAND[process.env.STAND]}@${SENTRY_HOST_BY_STAND[process.env.STAND]}/${SENTRY_PROJECTS_BY_STAND[process.env.STAND]}`;

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
    const url = `http://${SENTRY_HOST_BY_STAND[process.env.STAND]}/api/2/store/?sentry_version=7&sentry_client=raven-js%2F3.7.0&sentry_key=${SENTRY_KEYS_BY_STAND[process.env.STAND]}`;
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
