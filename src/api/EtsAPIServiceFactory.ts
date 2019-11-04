import ApiServiceFactory from './ApiServiceFactory';
import config from 'config';

const ETS_API_FACTORY = new ApiServiceFactory({
  apiUrl: config.backend,
  headers: () => {
    const token = JSON.parse(window.localStorage.getItem(global.SESSION_KEY));

    return {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    };
  },
});

export default ETS_API_FACTORY;
