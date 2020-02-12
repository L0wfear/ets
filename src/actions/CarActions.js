import { Actions } from 'flummox';
import { get } from 'lodash';
import { makeUnixTimeMskTimezone } from 'components/@next/@utils/dates/dates';
import config from 'config';
import { InfoService } from 'api/Services';

export default class CarActions extends Actions {
  getInfoFromCar(gps_code, from_dt, to_dt) {
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
      from_dt: makeUnixTimeMskTimezone(from_dt),
      to_dt: makeUnixTimeMskTimezone(to_dt),
      version,
    };

    return InfoService.get(payload);
  }
}
