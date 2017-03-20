const PROTO = window.location.protocol;
const WS_PROTO = 'ws:';

const config = {
  ws: `${WS_PROTO}//ods.mos.ru/ssd/city-dashboard/stream`,
  images: `${PROTO}//ods.mos.ru/ssd/ets/data/images/`,
};

const STANDS = {
  stage: `${PROTO}//ets.tech.mos.ru/ets-test/services`,
  prod: `${PROTO}//ets.tech.mos.ru/ets-study/services`,
  dev: `${PROTO}//dev-ets.gost-group.com/ets-dev/services`,
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
