// const PROTO_FOR_STAGE = (window.location.host === 'localhost') ? 'https:' : window.location.protocol;
// const PROTO_FOR_PROD = (window.location.host === 'localhost') ? 'http:' : window.location.protocol;

const WS_PROTO = `ws${/s/.test(window.location.protocol) ? 's' : ''}:`;
const HOST = process.env.APIHOST;
const STAND = process.env.STAND;
const PROTO = (STAND === 'prod') ? 'http:' : (STAND === 'stage') ? 'https:' : 'http:';

const DOC_URL = {
  dev: `${PROTO}//dev-ets.gost-group.com/docs/`,
  stage: `${PROTO}//ets.mos.ru/ets-stage/docs/`,
  prod: `${PROTO}//ets.tech.mos.ru/ets-study/docs/`,
};

const config = {
  ws: `${WS_PROTO}//ods.mos.ru/ssd/city-dashboard/stream`,
  images: `${PROTO}//ods.mos.ru/ssd/ets/data/images/`,
  docs: DOC_URL[process.env.STAND],
};

const STANDS = {
  stage: `${PROTO}//ets.mos.ru/ets-stage/services`,
  prod: `${PROTO}//ets.tech.mos.ru/ets-study/services`,
  dev: `${PROTO}//dev-ets.gost-group.com/services`,
};

try {
  if (HOST) {
    config.backend = `${PROTO}//${process.env.APIHOST}`;
  } else if (STAND) {
    config.backend = STANDS[STAND] || STANDS.dev;
  }
} catch (e) {
  console.log(e);
}

export default config;
