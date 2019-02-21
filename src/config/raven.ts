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
    url: 'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
    options: {
      environment: 'dev',
    },
  },
  gost_stage: {
    url: 'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
    options: {
      environment: 'gost_stage',
    },
  },
  ets_test: {
    url: 'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
    options: {
      environment: 'ets_test',
    },
  },
  ets_hotfix: {
    url: 'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
    options: {
      environment: 'ets_hotfix',
    },
  },
  prod: {
    url: 'https://33f25c9b9b534c298a90f2726b0fb91b@sentry.gost-group.com/11',
    options: {
      environment: 'prod',
    },
  },
};

const config = SentryData[process.env.STAND];
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
