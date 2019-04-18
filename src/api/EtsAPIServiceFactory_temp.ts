import ApiServiceFactory from './ApiServiceFactory';
import config, { configApi } from 'config';

const ETS_API_FACTORY_ETS_TEST = new ApiServiceFactory({
  apiUrl:
    process.env.STAND === 'dev' || process.env.STAND === 'gost_stage' ? configApi.develop.ets_test : config.backend,
  otherToken: true,
  headers: () => {
    const token = JSON.parse(
      window.localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV2),
    );
    return {
      "Authorization": `Token ${token}`,
      "Accept": 'application/json',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    };
  },
});

export default ETS_API_FACTORY_ETS_TEST;
