
const PROTO_FOR_STAGE = (window.location.host === 'localhost:3000') ? 'https:' : window.location.protocol;
const PROTO_FOR_PROD =  (window.location.host === 'localhost:3000') ? 'https:' : window.location.protocol;

const DOMAIN_FOR_STAGE = (PROTO_FOR_STAGE === 'http:') ? 'ets.tech.mos.ru' : 'ets.mos.ru';
const DOMAIN_FOR_PROD = (PROTO_FOR_PROD === 'http:') ? 'ets.tech.mos.ru' : 'ets.mos.ru';

const STAND = process.env.STAND;

export const PROTO_FOR_ODS_MOS_RU = (STAND === 'prod') ? PROTO_FOR_PROD : (STAND === 'stage') ? PROTO_FOR_STAGE : 'http:';
const WS_PROTO = 'wss:';

const DOC_URL = {
  dev: 'http://dev-ets.gost-group.com/docs/',
  stage: `${PROTO_FOR_STAGE}//${DOMAIN_FOR_STAGE}/ets-stage/docs/`,
  prod: `${PROTO_FOR_PROD}//${DOMAIN_FOR_PROD}/ets-study/docs/`,
};

const config = {
  ws: `${WS_PROTO}//psd.mos.ru/city-dashboard/stream`,
  images: `${PROTO_FOR_ODS_MOS_RU}//ets.mos.ru/ets/data/images/`,
  docs: DOC_URL[process.env.STAND],
};

const STANDS = {
  dev: 'http://dev-ets.gost-group.com/services',
  stage: `${PROTO_FOR_STAGE}//${DOMAIN_FOR_STAGE}/ets-stage/services`,
  prod: `${PROTO_FOR_PROD}//${DOMAIN_FOR_PROD}/ets-study/services`,
};

try {
  const HOST = process.env.APIHOST;
  if (HOST) {
    const PROTO = window.location.protocol;

    config.backend = `${PROTO}://${process.env.APIHOST}`;
  } else if (STAND) {
    config.backend = STANDS[STAND] || STANDS.dev;
  }
} catch (e) {
  console.log(e);
}

export default config;
