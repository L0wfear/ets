//let ENV = 'development';
let ENV = 'production';

let domains =
      ENV === 'development' ?

        {
          web:'localhost:9001',
          ws: 'localhost:8016'
        } :

        {
          web:'ods.mos.ru',
          ws: 'ods.mos.ru'
        }

let config = {
  backend: 'http://'+domains.web+'/ssd/city-dashboard',
  ws: 'ws://'+domains.ws+'/ssd/city-dashboard/stream',
  images: '/data/images/',
  REQUEST_PARAMS: {
    credentials: 'include'
  }
};



export default config;
