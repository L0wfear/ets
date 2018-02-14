const PROTO_FOR_PROD = (window.location.host === 'localhost:3000') ? 'http' : window.location.protocol;
const PROTO_FOR_STAGE = (window.location.host === 'localhost:3000') ? 'https' : window.location.protocol;
console.log('PROTO_FOR_STAGE', PROTO_FOR_STAGE);
const PROTO_FOR_DEV = (window.location.host === 'localhost:3000') ? 'http' : window.location.protocol;

const STAND = process.env.STAND;
export const PROTO_FOR_ODS_MOS_RU = (STAND === 'prod') ? 'http' : (STAND === 'stage') ? 'https' : 'http';
const WS_PROTO = `ws${/s/.test(window.location.protocol) ? 's' : ''}`;

const DOC_URL = {
  dev: `${PROTO_FOR_DEV}://dev-ets.gost-group.com/docs/`,
  stage: `${PROTO_FOR_STAGE}://ets.mos.ru/ets-stage/docs/`,
  prod: `${PROTO_FOR_PROD}://ets.tech.mos.ru/ets-study/docs/`,
};

const config = {
  ws: `${WS_PROTO}://ods.mos.ru/ssd/city-dashboard/stream`,
  images: `${PROTO_FOR_ODS_MOS_RU}://ods.mos.ru/ssd/ets/data/images/`,
  docs: DOC_URL[process.env.STAND],
};

const STANDS = {
  stage: `${PROTO_FOR_STAGE}://ets.mos.ru/ets-stage/services`,
  prod: `${PROTO_FOR_PROD}://ets.tech.mos.ru/ets-study/services`,
  dev: `${PROTO_FOR_DEV}://dev-ets.gost-group.com/services`,
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
