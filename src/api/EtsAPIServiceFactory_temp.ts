import ApiServiceFactory from './ApiServiceFactory';
import config, { host_dev } from 'config';

const ETS_API_FACTORY_ETS_TEST = new ApiServiceFactory({
  apiUrl:
    process.env.STAND === 'gost_stage' || process.env.STAND === 'ets_hotfix' ? `https://${host_dev.ets_test}services` : config.backend,
  otherToken: true,
  headers: () => {
    const token = JSON.parse(
      window.localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV) || null,
    );
    return {
      "Authorization": `Token ${token}`,
      "Accept": 'application/json',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    };
  },
});

export default ETS_API_FACTORY_ETS_TEST;
