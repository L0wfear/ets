import { Actions } from 'flummox';
import { get } from 'lodash';
import { makeUnixTime } from 'components/@next/@utils/dates/dates';
import config from 'config';
import { InfoService } from 'api/Services';

export default class CarActions extends Actions {
  async getInfoFromCar(gps_code, from_dt, to_dt) {
    let version = get(
      JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
      [config.tracksCaching],
      '',
    );
    const test_version = get(
      JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
      [`TEST::${config.tracksCaching}`],
      '',
    );

    if (test_version) {
      version = test_version;
    }
    const payload = {
      gps_code,
      from_dt: makeUnixTime(from_dt),
      to_dt: makeUnixTime(to_dt),
      version,
    };

    try {
      const result = await InfoService.get(payload);
      return result;
    } catch {
      global.NOTIFICATION_SYSTEM.notify(
        'Ошибка загрузки данных трека',
        'error',
        'tr',
      );
      return {
        distance: null,
        consumption: null,
      };
    }
  }
}
