import { Actions } from 'flummox';
import { get } from 'lodash';
import { makeUnixTime } from 'utils/dates';
import config from 'config';
import { InfoService } from 'api/Services';

export default class CarActions extends Actions {
  getInfoFromCar(gps_code, from_dt, to_dt) {
    let version = get(
      JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'),
      [config.tracksCaching],
      '',
    );
    const test_version = get(
      JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'),
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

    return InfoService.get(payload);
  }
}
