
/**
 * При разработке не имеем доступ к протоколу, хосту и всему прочему, если не хардкод
 */
const PROTO = window.location.protocol;
const HOST = window.location.host;
const PATHNAME = window.location.pathname;

const WS_PROTO = 'wss:';

const DOC_URL = {
  develop: {
    dev: 'http://dev-ets.gost-group.com/docs/',
    stage: 'https://ets-test.mos.ru/ets-stage/docs/',
    prod: 'https://213.79.88.5/ets-study/docs/',
  },
  origin: {
    dev: 'http://dev-ets.gost-group.com/docs/',
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
    stage: 'wss://ets-test.mos.ru/ets-stage/services/notification_ws',
    prod: 'wss://213.79.88.5/ets-study/services/notification_ws',
    dev: 'ws://dev-ets.gost-group.com/services/notification_ws',
  },
  origin: {
    stage: `wss://${HOST}${PATHNAME}services/notification_ws`,
    prod: `wss://${HOST}${PATHNAME}ets-study/services/notification_ws`,
    dev: `ws://${HOST}${PATHNAME}services/notification_ws`,
  },
};

const STANDS = {
  develop: {
    stage: 'https://ets-test.mos.ru/ets-stage/services',
    prod: 'https://213.79.88.5/ets-study/services',
    dev: 'http://dev-ets.gost-group.com/services',
  },
  origin: {
    stage: `${PROTO}//${HOST}${PATHNAME}services`,
    prod: `${PROTO}//${HOST}${PATHNAME}ets-study/services`,
    dev: 'http://dev-ets.gost-group.com/services',
  },
};

const configs = {};
const pathToConfig = __DEVELOPMENT__ ? 'develop' : 'origin';

try {
  const STAND = process.env.STAND;

  configs.ws = config[pathToConfig].ws;
  configs.images = config[pathToConfig].images;
  configs.docs = config[pathToConfig].docs;
  configs.backend = STANDS[pathToConfig][STAND] || STANDS[pathToConfig].dev;
  configs.notification_ws = notification_config[pathToConfig][STAND] || notification_config[pathToConfig].dev;
} catch (e) {
  console.log(e); // eslint-disable-line
}

global.showConfigs = () => console.log(configs);

export default configs;
