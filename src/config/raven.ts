import * as Raven from 'raven-js';

const ACTIVE = !__DEVELOPMENT__;

const SENTRY_URL = {
  dev: 'https://85e9a02b4661432bb567038c9cfba5db@sentry.gost-group.com/10',
  dev2: 'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
  stage: 'https://611069a7669747698ce81d794de548aa@sentry.gost-group.com/12',
  stage2: 'https://f0ac8ad0b1984b27b0ccecaa96d0d010@sentry.gost-group.com/13',
  prod: 'https://7cad206b538c45d4a70fe9853d40f67d@sentry.gost-group.com/14',
  prod2: 'https://2c07fafef3094de880b7ab0db8c9f38c@sentry.gost-group.com/15',
};

const URL = SENTRY_URL[`${process.env.STAND}2`];
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

if (ACTIVE) {
  Raven.config(URL).install();
}
