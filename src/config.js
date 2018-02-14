const PROTO_FOR_PROD = (window.location.host === 'localhost:3000') ? 'https:' : window.location.protocol;
const PROTO_FOR_STAGE = (window.location.host === 'localhost:3000') ? 'https:' : window.location.protocol;

const DOMAIN_FOR_PROD = (PROTO_FOR_PROD === 'http:') ? 'ets.tech.mos.ru' : 'ets.mos.ru';
const DOMAIN_FOR_STAGE = (PROTO_FOR_STAGE === 'http:') ? 'ets.tech.mos.ru' : 'ets.mos.ru';

const STAND = process.env.STAND;
console.log('STAND ', STAND, 'PROTO_FOR_PROD', PROTO_FOR_PROD);

export const PROTO_FOR_ODS_MOS_RU = (STAND === 'prod') ? PROTO_FOR_PROD : (STAND === 'stage') ? PROTO_FOR_STAGE : 'http:';
const WS_PROTO = `ws${/s/.test(window.location.protocol) ? 's' : ''}:`;

const DOC_URL = {
  dev: 'http://dev-ets.gost-group.com/docs/',
  stage: `${PROTO_FOR_STAGE}//${DOMAIN_FOR_STAGE}/ets-stage/docs/`,
  prod: `${DOMAIN_FOR_PROD}//${DOMAIN_FOR_PROD}/ets-study/docs/`,
};

const config = {
  ws: `${WS_PROTO}//ods.mos.ru/ssd/city-dashboard/stream`,
  images: `${PROTO_FOR_ODS_MOS_RU}//ods.mos.ru/ssd/ets/data/images/`,
  docs: DOC_URL[process.env.STAND],
};

const STANDS = {
  stage: `${PROTO_FOR_STAGE}//${DOMAIN_FOR_STAGE}/ets-stage/services`,
  prod: `${PROTO_FOR_PROD}//${DOMAIN_FOR_PROD}/ets-study/services`,
  dev: 'http://dev-ets.gost-group.com/services',
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
