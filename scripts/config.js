let ENV = process.env.NODE_ENV || 'development';

let WEBPACK_CONFIG = {
  development: {
    isProduction: false,
    port: 3000,
    apiPort: 3030,
    app: {
      name: 'Development'
    }
  },
  production: {
    isProduction: true,
    port: process.env.PORT,
    apiPort: 3030,
    app: {
      name: 'Production'
    }
  }
}

let PROTO = window.location.protocol;
let WS_PROTO = PROTO === 'http:' ? 'wss:' : 'wss:';

let config = {
  backend: PROTO + '//213.79.88.5/ssd/ets/services',
  backendOld: PROTO + '//213.79.88.5/ssd/city-dashboard',
  ws: WS_PROTO + '//213.79.88.5/ssd/city-dashboard/stream',
  images: '/data/images/',
  REQUEST_PARAMS: {
    credentials: 'include'
  },
  WEBPACK_CONFIG: WEBPACK_CONFIG[ENV]
};

try {
  switch (process.env.STAND) {
    case 'study':
      config.backend = PROTO + '//213.79.88.5/ssd/ets-study/services';
      break;
    case 'test':
      config.backend = PROTO + '//213.79.88.5/ssd/ets-test/services';
      break;
    case 'development':
      config.backend = PROTO + '//213.79.88.5/ssd/ets-test/services';
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
