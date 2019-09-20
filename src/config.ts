/**
 * При разработке не имеем доступ к протоколу, хосту и всему прочему, если не хардкод
 */
const PROTO = window.location.protocol;
const HOST = window.location.host;
const PATHNAME = window.location.pathname;

const WS_PROTO = (
  PROTO === 'https:'
    ? 'wss:'
    : 'ws:'
);
const STAND = process.env.STAND;

const hostTypes = {
  develop: {
    dev: 'dev2-ets.gost-group.com/',
    gost_stage: 'ets-stage.gost-group.com/',
    ets_test: 'ets-test.mos.ru/',
    ets_hotfix: 'ets-hotfix.mos.ru/',
    prod: 'ets.mos.ru/',
  },
  origin: HOST,
};
const urls = {
  develop: {
    dev: `http://${hostTypes.develop.dev}`,
    gost_stage: `https://${hostTypes.develop.gost_stage}`,
    ets_test: `https://${hostTypes.develop.ets_test}`,
    ets_hotfix: `https://${hostTypes.develop.ets_hotfix}`,
    prod: `https://${hostTypes.develop.prod}`,
  },
  origin: `${PROTO}//${HOST}${PATHNAME}`,
};

const ADMIN_URL = {
  develop: {
    dev: `${urls.develop.dev}admin`,
    gost_stage: `${urls.develop.gost_stage}admin`,
    ets_test: `${urls.develop.ets_test}admin`,
    ets_hotfix: `${urls.develop.ets_hotfix}admin`,
    prod: `${urls.develop.prod}admin`,
  },
  origin: `${PROTO}//${HOST}${PATHNAME}admin/`,
};

const DOC_URL = {
  develop: {
    dev: `${urls.develop.dev}docs/`,
    gost_stage: `${urls.develop.gost_stage}docs/`,
    ets_test: `${urls.develop.ets_test}docs/`,
    ets_hotfix: `${urls.develop.ets_hotfix}docs/`,
    prod: `${urls.develop.prod}docs/`,
  },
  origin: `${PROTO}//${HOST}${PATHNAME}docs/`,
};

const config = {
  develop: {
    images: `${urls.develop.prod}ets/data/images/`,
    docs: DOC_URL.develop[process.env.STAND],
    admin: ADMIN_URL.develop[process.env.STAND],
  },
  origin: {
    images: `${urls.develop.prod}ets/data/images/`,
    docs: DOC_URL.origin,
    admin: ADMIN_URL.origin,
  },
};

const notification_config = {
  develop: {
    dev: 'ws://dev2-ets.gost-group.com/services/notification_ws',
    gost_stage: 'wss://ets-stage.gost-group.com/services/notification_ws',
    ets_test: 'wss://ets-test.mos.ru/services/notification_ws',
    ets_hotfix: 'wss://ets-hotfix.mos.ru/services/notification_ws',
    prod: 'wss://ets.mos.ru/services/notification_ws',
  },
  origin: `${WS_PROTO}//${HOST}${PATHNAME}services/notification_ws`,
};

export const configApi = {
  develop: {
    dev: `${urls.develop.dev}services`,
    gost_stage: `${urls.develop.gost_stage}services`,
    ets_test: `${urls.develop.ets_test}services`,
    ets_hotfix: `${urls.develop.ets_hotfix}services`,
    prod: `${urls.develop.prod}services`,
  },
  origin: `${PROTO}//${HOST}${PATHNAME}services`,
};

const configs = {
  url: urls.develop.dev,
  images: config.develop.images,
  docs: config.develop.docs,
  admin: config.develop.admin,
  backend: configApi.develop.dev,
  notification_ws: notification_config.develop.dev,
  tracksCaching: `https://psd.mos.ru/tracks-caching${
    STAND !== 'prod' ? '-dev' : ''
  }`,
};
const pathToConfig = __DEVELOPMENT__ ? 'develop' : 'origin';

try {
  configs.url = (
    pathToConfig === 'develop'
      ? urls[pathToConfig][STAND]
      : urls.origin
  );
  configs.images = config[pathToConfig].images;
  configs.docs = config[pathToConfig].docs;
  configs.admin = config[pathToConfig].admin;
  configs.backend = (
    pathToConfig === 'develop'
      ? configApi[pathToConfig][STAND]
      : configApi.origin
  );

  configs.notification_ws = (
    pathToConfig === 'develop'
      ? notification_config[pathToConfig][STAND]
      : notification_config.origin
  );
} catch (e) {
  // tslint:disable-next-line
  console.warn(e);
}

export default configs;
