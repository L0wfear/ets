import * as Raven from 'raven-js';

const ACTIVE = !__DEVELOPMENT__;

export const initSentry = (environment) => {
  if (ACTIVE) {
    Raven.config(
      'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
      {
        environment,
      },
    ).install();
  }
};

export function setUserContext(user) {
  if (ACTIVE) {
    Raven.setUserContext(user);
  }
}
