/**
 * При разработке не имеем доступ к протоколу, хосту и всему прочему, если не хардкод
 */
const PROTO = window.location.protocol;
const HOST = window.location.host;
const PATHNAME = window.location.pathname;

const STAND = process.env.STAND;

const urls = {
  develop: {
    dev: 'http://dev2-ets.gost-group.com/',
    gost_stage: 'https://ets-stage.gost-group.com/',
    ets_test: 'https://ets-test.mos.ru/',
    ets_hotfix: 'https://ets-hotfix.mos.ru/',
    prod: 'http://ets.mos.ru/',
  },
  origin: `${PROTO}//${HOST}${PATHNAME}`,
};

const ADMIN_URL = {
  develop: {
    dev: 'https://dev2-ets.gost-group.com/admin',
    gost_stage: 'https://ets-stage.gost-group.com/admin/',
    ets_test: 'https://ets-test.mos.ru/admin/',
    ets_hotfix: 'https://ets-hotfix.mos.ru/admin/',
    prod: 'https://ets.mos.ru/admin/',
  },
  origin: `${PROTO}//${HOST}${PATHNAME}admin/`,
};

const DOC_URL = {
  develop: {
    dev: 'https://dev2-ets.gost-group.com/docs/',
    gost_stage: 'https://ets-stage.gost-group.com/docs/',
    ets_test: 'https://ets-test.mos.ru/docs/',
    ets_hotfix: 'https://ets-hotfix.mos.ru/docs/',
    prod: 'https://ets.mos.ru/docs/',
  },
  origin: `${PROTO}//${HOST}${PATHNAME}docs/`,
};

const config = {
  develop: {
    images: 'https://ets.mos.ru/ets/data/images/',
    docs: DOC_URL.develop[process.env.STAND],
    admin: ADMIN_URL.develop[process.env.STAND],
  },
  origin: {
    images: `https://ets.mos.ru/ets/data/images/`,
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
  origin: `wss://${HOST}${PATHNAME}services/notification_ws`,
};

export const configApi = {
  develop: {
    dev: 'https://dev2-ets.gost-group.com/services',
    gost_stage: 'https://ets-stage.gost-group.com/services',
    ets_test: 'https://ets-test.mos.ru/services',
    ets_hotfix: 'https://ets-hotfix.mos.ru/services',
    prod: 'https://ets.mos.ru/services',
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
