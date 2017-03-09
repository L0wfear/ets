const PROTO = window.location.protocol;
const WS_PROTO = 'ws:';

const config = {
  ws: `${WS_PROTO}//ods.mos.ru/ssd/city-dashboard/stream`,
  images: `${PROTO}//ods.mos.ru/ssd/ets/data/images/`,
};

const STANDS = {
  test: `${PROTO}//ets.tech.mos.ru/ets-test/services`,
  study: `${PROTO}//ets.tech.mos.ru/ets-study/services`,
};

try {
  const HOST = process.env.APIHOST;
  const STAND = process.env.STAND;
  if (HOST) {
    config.backend = `${PROTO}//${process.env.APIHOST}`;
  } else if (STAND) {
    config.backend = STANDS[STAND] || STANDS.test;
  }
} catch (e) {
  console.log(e);
}

export default config;
