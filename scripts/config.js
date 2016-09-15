const PROTO = window.location.protocol;
const WS_PROTO = 'wss:';

const config = {
  ws: `${WS_PROTO}//ods.mos.ru/ssd/city-dashboard/stream`,
  images: `${PROTO}//ods.mos.ru/ssd/ets/data/images/`,
};

const STANDS = {
  test: `${PROTO}//213.79.88.5/ets-test/services`,
  study: `${PROTO}//213.79.88.5/ets-study/services`,
};

try {
  if (process.env.APIHOST) {
    config.backend = `${PROTO}//${process.env.APIHOST}`;
  } else if (process.env.STAND) {
    config.backend = STANDS[process.env.STAND] || STANDS.test;
  }
} catch (e) {
  console.log(e);
}

export default config;
