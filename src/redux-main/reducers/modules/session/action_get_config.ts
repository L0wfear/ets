import {
  SESSION_SET_CONFIG,
  CONFIG_INITIAL,
} from 'redux-main/reducers/modules/session/session';

import { ConfigService } from 'api/Services';

export const sessionSetAppConfig = () => ({
  type: SESSION_SET_CONFIG,
  payload: ConfigService.get()
    .catch((errorData) => {
      // tslint:disable-next-line
      console.warn(errorData);

      return CONFIG_INITIAL;
    })
    .then((appConfigRaw) => {
      const appConfig = appConfigRaw;

      // appConfig.points_ws = 'wss://ets-test.mos.ru/services/stream'; для теста

      return {
        appConfig,
      };
    }),
  meta: {
    loading: true,
  },
});
