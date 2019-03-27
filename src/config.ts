
/**
 * При разработке не имеем доступ к протоколу, хосту и всему прочему, если не хардкод
 */
const PROTO = window.location.protocol;
const HOST = window.location.host;
const PATHNAME = window.location.pathname;

const WS_PROTO = 'wss:';
const STAND = process.env.STAND;

const ADMIN_URL = {
  develop: {
    dev: 'http://dev2-ets.gost-group.com/admin',
    gost_stage: 'https://ets-stage.gost-group.com/admin/',
    ets_test: 'https://ets-test.mos.ru/admin/',
    ets_hotfix: 'https://ets-hotfix.mos.ru/admin/',
    prod: 'http://ets.mos.ru/admin/',
  },
  origin: {
    dev: 'http://dev2-ets.gost-group.com/admin/',
    gost_stage: `${PROTO}//${HOST}${PATHNAME}admin/`,
    ets_test: `${PROTO}//${HOST}${PATHNAME}admin/`,
    ets_hotfix: `${PROTO}//${HOST}${PATHNAME}admin/`,
    prod: `${PROTO}//${HOST}${PATHNAME}admin/`,
  },
};

const DOC_URL = {
  develop: {
    dev: 'http://dev2-ets.gost-group.com/docs/',
    gost_stage: 'https://ets-stage.gost-group.com/docs/',
    ets_test: 'https://ets-test.mos.ru/docs/',
    ets_hotfix: 'https://ets-hotfix.mos.ru/docs/',
    prod: 'http://ets.mos.ru/docs/',
  },
  origin: {
    dev: 'http://dev2-ets.gost-group.com/docs/',
    gost_stage: `${PROTO}//${HOST}${PATHNAME}docs/`,
    ets_test: `${PROTO}//${HOST}${PATHNAME}docs/`,
    ets_hotfix: `${PROTO}//${HOST}${PATHNAME}docs/`,
    prod: `${PROTO}//${HOST}${PATHNAME}docs/`,
  },
};

const config = {
  develop: {
    ws: `${WS_PROTO}//ets${STAND !== 'prod' ? '-test' : ''}.mos.ru/services/stream`,
    images: 'https://ets.mos.ru/ets/data/images/',
    docs: DOC_URL.develop[process.env.STAND],
    admin: ADMIN_URL.develop[process.env.STAND],
  },
  origin: {
    ws: `${WS_PROTO}//ets${STAND !== 'prod' ? '-test' : ''}.mos.ru/services/stream`,
    images: `${PROTO}//ets.mos.ru/ets/data/images/`,
    docs: DOC_URL.origin[process.env.STAND],
    admin: ADMIN_URL.origin[process.env.STAND],
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
  origin: {
    dev: `ws://${HOST}${PATHNAME}services/notification_ws`,
    gost_stage: `wss://${HOST}${PATHNAME}services/notification_ws`,
    ets_test: `wss://${HOST}${PATHNAME}services/notification_ws`,
    ets_hotfix: `wss://${HOST}${PATHNAME}services/notification_ws`,
    prod: `wss://${HOST}${PATHNAME}services/notification_ws`,
  },
};

const STANDS = {
  develop: {
    dev: 'http://dev2-ets.gost-group.com/services',
    gost_stage: 'https://ets-stage.gost-group.com/services',
    ets_test: 'https://ets-test.mos.ru/services',
    ets_hotfix: 'https://ets-hotfix.mos.ru/services',
    prod: 'https://ets.mos.ru/services',
  },
  origin: {
    dev: 'http://dev2-ets.gost-group.com/services',
    gost_stage: `${PROTO}//${HOST}${PATHNAME}services`,
    ets_test: `${PROTO}//${HOST}${PATHNAME}services`,
    ets_hotfix: `${PROTO}//${HOST}${PATHNAME}services`,
    prod: `${PROTO}//${HOST}${PATHNAME}services`,
  },
};

const configs = {
  ws: config.develop.ws,
  images: config.develop.images,
  docs: config.develop.docs,
  admin: config.develop.admin,
  backend: STANDS.develop.dev,
  notification_ws: notification_config.develop.dev,
  tracksCaching: `https://psd.mos.ru/tracks-caching${STAND !== 'prod' ? '-dev' : ''}`,
};
const pathToConfig = __DEVELOPMENT__ ? 'develop' : 'origin';

try {
  configs.ws = config[pathToConfig].ws;
  configs.images = config[pathToConfig].images;
  configs.docs = config[pathToConfig].docs;
  configs.admin = config[pathToConfig].admin;
  configs.backend = STANDS[pathToConfig][STAND] || STANDS[pathToConfig].dev;
  configs.notification_ws = notification_config[pathToConfig][STAND] || notification_config[pathToConfig].dev;
} catch (e) {
  // tslint:disable-next-line
  console.warn(e);
}

export default configs;
