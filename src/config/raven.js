import Raven from 'raven-js';

const SENTRY_KEY_TEST = '74b98d69b05c4a958c4c247eecaf74a4';
const SENTRY_KEY_STUDY = '2a7cb44593f2419e8f123f52435a3fb0';

export function setUserContext(user) {
  Raven.setUserContext(user);
}

export function resetUserContext() {
  Raven.setUserContext();
}

export function config() {
  Raven.config('http://ets.tech.mos.ru/sentry').install();
  // Raven.setTransport((options) => {
  //   fetch(`http://ets.tech.mos.ru/sentry/store/?sentry_version=7&sentry_client=raven-js%2F3.7.0&sentry_key=${SENTRY_KEY_TEST}`, {
  //     method: 'post',
  //     body: JSON.stringify(options.data),
  //     mode: 'no-cors'
  //   });
  // });
  // Raven._globalKey = SENTRY_KEY_TEST;
  // Raven._globalEndpoint = Raven._globalEndpoint.replace('api/', '');
}
