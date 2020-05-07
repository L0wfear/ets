import { get } from 'lodash';

import { TrackInfoService } from 'api/Services';
import config from 'config';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { makeUnixTimeMskTimezone } from 'components/@next/@utils/dates/dates';
import { TrackInfo } from 'redux-main/reducers/modules/some_uniq/track/@types';

export const promiseGetTrackInfo = async (payloadOwn: { gps_code: Car['gps_code']; from_dt: Parameters<typeof makeUnixTimeMskTimezone>[0]; to_dt: Parameters<typeof makeUnixTimeMskTimezone>[0]; }) => {
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
    gps_code: payloadOwn.gps_code,  // <<< gps_code global
    from_dt: makeUnixTimeMskTimezone(payloadOwn.from_dt),
    to_dt: makeUnixTimeMskTimezone(payloadOwn.to_dt),
    version,
  };
  try {
    const response = await TrackInfoService.get<TrackInfo>(payload);
    return response;
  } catch {
    global.NOTIFICATION_SYSTEM.notify(
      'Ошибка загрузки данных трека',
      'error',
      'tr',
    );
    return {
      distance: null,
      consumption: null,
      sensor_refill: null,
    };
  }
};
