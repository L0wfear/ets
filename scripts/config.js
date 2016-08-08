const PROTO = window.location.protocol;
const WS_PROTO = 'wss:';

let config = {
  backend: PROTO + '//ods.mos.ru/ssd/ets/services',
  backendOld: PROTO + '//ods.mos.ru/ssd/city-dashboard',
  ws: WS_PROTO + '//ods.mos.ru/ssd/city-dashboard/stream',
  images: PROTO + '//ods.mos.ru/ssd/ets/data/images/',
  REQUEST_PARAMS: {
    credentials: 'include'
  }
};

console.log(process.env);

try {
  switch (process.env.STAND) {
    case 'study':
      config.backend = PROTO + '//ods.mos.ru/ssd/ets-study/services';
      break;
    case 'test':
      config.backend = PROTO + '//ods.mos.ru/ssd/ets-test/services';
      break;
    case 'development':
      config.backend = PROTO + '//ods.mos.ru/ssd/ets-test/services';
      break;
    case 'second':
      config.backend = PROTO + '//213.79.88.5/ets-test/services';
      break;
    case 'secondstudy':
      config.backend = PROTO + '//213.79.88.5/ets-study/services';
      break;
  }
} catch (e) {
}

// локальный сервер или специфичный стенд
let localServerUrl;

try {
  localServerUrl = LOCAL_SERVER_URL;
  if (localServerUrl) {
    config.backend = localServerUrl;
  }
} catch (e) {
  localServerUrl = null;
}

export default config;
