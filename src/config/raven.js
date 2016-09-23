import Raven from 'raven-js';

export function setUserContext(user) {
  Raven.setUserContext(user);
}

export function resetUserContext() {
  Raven.setUserContext();
}

export function config() {
  Raven.config('http://ets.tech.mos.ru/sentry').install();
}
