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
  backend: PROTO + '//ods.mos.ru/ssd/ets/services',//city-dashboard',
  backendOld: PROTO + '//ods.mos.ru/ssd/city-dashboard',
  ws: WS_PROTO + '//ods.mos.ru/ssd/city-dashboard/stream',
  images: '/data/images/',
  REQUEST_PARAMS: {
    credentials: 'include'
  },
  WEBPACK_CONFIG: WEBPACK_CONFIG[ENV]
};

export default config;
