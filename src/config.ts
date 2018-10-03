
/**
 * При разработке не имеем доступ к протоколу, хосту и всему прочему, если не хардкод
 */
const PROTO = window.location.protocol;
const HOST = window.location.host;
const PATHNAME = window.location.pathname;

const WS_PROTO = 'wss:';
const STAND = process.env.STAND;

const DOC_URL = {
  develop: {
    dev: 'http://dev2-ets.gost-group.com/docs/',
    stage: 'https://ets-test.mos.ru/ets-stage2/docs/',
    prod: 'http://ets2.mos.ru/docs/',
  },
  origin: {
    dev: 'http://dev2-ets.gost-group.com/docs/',
    stage: `${PROTO}//${HOST}${PATHNAME}docs/`,
    prod: `${PROTO}//${HOST}${PATHNAME}docs/`,
  },
};

const config = {
  develop: {
    ws: `${WS_PROTO}//psd.mos.ru/city-dashboard/stream`,
    images: 'https://ets.mos.ru/ets/data/images/',
    docs: DOC_URL.develop[process.env.STAND],
  },
  origin: {
    ws: `${WS_PROTO}//psd.mos.ru/city-dashboard/stream`,
    images: `${PROTO}//ets.mos.ru/ets/data/images/`,
    docs: DOC_URL.origin[process.env.STAND],
  },
};

const notification_config = {
  develop: {
    stage: 'wss://ets-test.mos.ru/ets-stage2/services/notification_ws',
    prod: 'wss://ets2.mos.ru/services/notification_ws',
    dev: 'ws://dev2-ets.gost-group.com/services/notification_ws',
  },
  origin: {
    stage: `wss://${HOST}${PATHNAME}services/notification_ws`,
    prod: `wss://${HOST}${PATHNAME}services/notification_ws`,
    dev: `ws://${HOST}${PATHNAME}services/notification_ws`,
  },
};

const STANDS = {
  develop: {
    stage: 'https://ets-test.mos.ru/ets-stage2/services',
    prod: 'https://ets2.mos.ru/services',
    dev: 'http://dev2-ets.gost-group.com/services',
  },
  origin: {
    stage: `${PROTO}//${HOST}${PATHNAME}services`,
    prod: `${PROTO}//${HOST}${PATHNAME}services`,
    dev: 'http://dev2-ets.gost-group.com/services',
  },
};

const configs = {
  ws: config.develop.ws,
  images: config.develop.images,
  docs: config.develop.docs,
  backend: STANDS.develop.dev,
  notification_ws: notification_config.develop.dev,
};
const pathToConfig = __DEVELOPMENT__ ? 'develop' : 'origin';

try {
  configs.ws = config[pathToConfig].ws;
  configs.images = config[pathToConfig].images;
  configs.docs = config[pathToConfig].docs;
  configs.backend = STANDS[pathToConfig][STAND] || STANDS[pathToConfig].dev;
  configs.notification_ws = notification_config[pathToConfig][STAND] || notification_config[pathToConfig].dev;
} catch (e) {
  console.log(e); // eslint-disable-line
}

export default configs;
