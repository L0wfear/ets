import Raven from 'raven-js';

const ACTIVE = true;
// stage // http://9cf00c5af7804d79ae36357a8eabeeb3@46.161.0.203/13
// prod // http://a882c1df2e384264bed48402cff3fa25@46.161.0.203/8
// dev // http://aa6710a11a65405bbad39136e062c3af@46.161.0.203/12
const SENTRY_KEYS_BY_STAND = {
  'stage': '9cf00c5af7804d79ae36357a8eabeeb3', // http://172.17.31.73:9000/sentry/ets-frontend-dev/
  'prod': 'a882c1df2e384264bed48402cff3fa25', // http://172.17.31.73:9000/sentry/ets-frontend-prod/
  'dev': 'aa6710a11a65405bbad39136e062c3af',
};
const SENTRY_PROJECTS_BY_STAND = {
  'stage': 14,
  'prod': 13,
  'dev': 12,
};
const SENTRY_HOST_BY_STAND = {
  'stage': '46.161.0.203',
  'prod': '46.161.0.203',
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
