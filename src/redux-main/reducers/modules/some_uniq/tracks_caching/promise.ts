import { TrackService } from 'api/Services';
import { get } from 'lodash';
import {
  checkAndModifyTrack,
} from 'redux-main/trash-actions/uniq/utils/utils';
import config from 'config';
import { makeUnixTime } from 'utils/dates';

export const promiseGetTracksCaching = async (payload) => {
  let response = null;
  let version = get(JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'), [config.tracksCaching], '');
  const test_version = get(JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'), [`TEST::${config.tracksCaching}`], '');
  if (test_version) {
    version = test_version;
  }

  const {
    gps_code,
    date_start,
    date_end,
    odh_mkad,
  } = payload;

  const payloadToTrack = {
    version,
    gps_code,
    from_dt: makeUnixTime(date_start),
    to_dt: date_end ? makeUnixTime(date_end) + 86340 : makeUnixTime(date_end), // <<< исправить
    sensors: 1,
  };

  try {
    response = await TrackService.get(payloadToTrack).then((ans) => ({
      ...ans,
      ...checkAndModifyTrack(ans, odh_mkad),
    }));
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  return {
    data: {
      ...response,
    },
  };
};
