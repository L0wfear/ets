import * as Raven from 'raven-js';

const ACTIVE = !__DEVELOPMENT__;

type SentryDataType = {
  [key: string]: {
    url: string;
    options?: Raven.RavenOptions;
  };
};

const SentryData: SentryDataType = {
  dev: {
    url: 'https://85e9a02b4661432bb567038c9cfba5db@sentry.gost-group.com/10',
  },
  dev2: {
    url: 'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
    options: {
      release: 'a3b328c8f85c11e88e5b0242ac120007',
    },
  },
  stage: {
    url: 'https://611069a7669747698ce81d794de548aa@sentry.gost-group.com/12',
  },
  stage2: {
    url: 'https://f0ac8ad0b1984b27b0ccecaa96d0d010@sentry.gost-group.com/13',
    options: {
      release: 'd6538712f85e11e8a32e0242ac120007',
    },
  },
  prod: {
    url: 'https://7cad206b538c45d4a70fe9853d40f67d@sentry.gost-group.com/14',
  },
  prod2: {
    url: 'https://2c07fafef3094de880b7ab0db8c9f38c@sentry.gost-group.com/15',
    options: {
      release: '3278b866f85d11e8a3450242ac120007',
    },
  },
};

const config = SentryData[`${process.env.STAND}2`];
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
  Raven.config(config.url, { ...config.options }).install();
}
