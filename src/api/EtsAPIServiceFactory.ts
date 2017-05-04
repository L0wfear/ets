import ApiServiceFactory from './ApiServiceFactory.js';
import config from '../config.js';

const globalObject: any = global;
const conf: any = config;

const ETS_API_FACTORY = new ApiServiceFactory({
  apiUrl: conf.backend,
  headers: () => {
    const token = JSON.parse(window.localStorage.getItem(globalObject.SESSION_KEY));
    return {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    };
  },
});

export default ETS_API_FACTORY;
