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

let config = {
  backend: 'http://ods.mos.ru/ssd/city-dashboard',
  ws: 'ws://ods.mos.ru/ssd/city-dashboard/stream',
  images: '/data/images/',
  REQUEST_PARAMS: {
    credentials: 'include'
  },
  WEBPACK_CONFIG: WEBPACK_CONFIG[ENV]
};

export default config;
