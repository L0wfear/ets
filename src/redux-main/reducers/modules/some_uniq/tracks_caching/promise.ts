import { TrackService } from 'api/Services';
import { get } from 'lodash';
import {
  checkAndModifyTrack,
} from 'components/old/monitor/info/car-info/redux-main/modules/utils';
import config from 'config';
import { makeUnixTimeMskTimezone } from 'components/@next/@utils/dates/dates';
import { Car } from '../../autobase/@types/autobase.h';
import { initialMonitorState } from 'components/old/monitor/redux-main/models/monitor-page';

type PromiseGetTracksCachingPayload = {
  car_id: Car['asuods_id'];
  date_start: string | Date;
  date_end: string | Date;
  odh_mkad?: any;
} & Record<string, any>;

export const promiseGetTracksCaching = async (payload: PromiseGetTracksCachingPayload) => {
  let response = null;
  let version = get(JSON.parse(localStorage.getItem(global.API__KEY) || '{}'), [config.tracksCaching], '');
  const test_version = get(JSON.parse(localStorage.getItem(global.API__KEY) || '{}'), [`TEST::${config.tracksCaching}`], '');
  if (test_version) {
    version = test_version;
  }

  const {
    car_id,
    date_start,
    date_end,
    odh_mkad,
  } = payload;

  const sensors = get(payload, 'sensors', 1);
  const payloadToTrack = {
    version,
    car_id,
    from_dt: makeUnixTimeMskTimezone(date_start),
    to_dt: makeUnixTimeMskTimezone(date_end),
    sensors,
  };

  if (Number(sensors) === 0) {
    delete payloadToTrack.sensors;
  }

  try {
    response = await TrackService.get(payloadToTrack).then(
      async (ans) => {
        const partialTrackCaching = await checkAndModifyTrack(ans, odh_mkad);
        return ({
          ...ans,
          ...partialTrackCaching,
        });
      },
    );
  } catch (error) {
    global.NOTIFICATION_SYSTEM.notify('Ошибка загрузки данных трека', 'error', 'tr');
    response = initialMonitorState.carInfo.trackCaching;
  }

  return response;
};
