const PROTO = window.location.host.includes('localhost') ? `http${process.env.STAND === 'dev' ? '' : 's'}:` : window.location.protocol;
const WS_PROTO = 'wss:';

const DOC_URL = {
  dev: `${PROTO}//dev-ets.gost-group.com/docs/`,
  stage: `${PROTO}//ets.mos.ru/ets-stage/docs/`,
  prod: `${PROTO}//ets.mos.ru/docs/`,
};

const config = {
  ws: `${WS_PROTO}//ods.mos.ru/ssd/city-dashboard/stream`,
  images: `http://ods.mos.ru/ssd/ets/data/images/`,
  docs: DOC_URL[process.env.STAND],
};

const STANDS = {
  stage: `${PROTO}//ets.mos.ru/ets-stage/services`,
  prod: `${PROTO}//ets.mos.ru/services`,
  dev: `${PROTO}//dev-ets.gost-group.com/services`,
};

try {
  const HOST = process.env.APIHOST;
  const STAND = process.env.STAND;
  if (HOST) {
    config.backend = `${PROTO}//${process.env.APIHOST}`;
  } else if (STAND) {
    config.backend = STANDS[STAND] || STANDS.dev;
  }
} catch (e) {
  console.log(e);
}

export default config;
