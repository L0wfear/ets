import {
  CompanyService,
  TrackService,
  TimeMoscowService,
} from 'api/Services';
import {
  get,
  keyBy,
} from 'lodash';
import config from 'config';
import { getDateWithMoscowTz, makeUnixTime } from 'utils/dates';
import {
  getCarGpsNumberByDateTime,
} from 'redux-main/trash-actions/car/promise/promise';

import {
  checkAndModifyTrack,
} from 'redux-main/trash-actions/uniq/utils/utils';

const colors = [];

Array(16).fill(1).map((d, r) =>
  Array(16).fill(1).map((_, g) =>
    Array(16).fill(1).map((__, b) =>
      colors.push(`rgb(${r * 16}, ${g * 16}, ${b * 16})`),
    ),
  ),
);

export const loadCompany = () => (
  CompanyService.get().then(({ result }) => {
    const companies = result.map((company) => ({
      ...company,
      rgb_color: company.rgb_color || colors[Math.ceil(Math.random() * 4096)],
    }));

    return {
      companies,
      companiesIndex: keyBy(companies, 'company_id'),
    };
  })
  .catch((error) => {
    // tslint:disable-next-line
    console.warn(error);

    return {
      companies: [],
      companiesIndex: {},
    };
  })
);

export const loadMoscowTime = () => (
  TimeMoscowService.get().then(({ result }) => ({
    time: result,
  }))
  .catch((error) => {
    // tslint:disable-next-line
    console.warn(error);
    return TimeMoscowService.get().then(({ result }) => ({
      time: result,
    }));
  })
  .catch(() => {
    return {
      time: {
        timestamp: +(getDateWithMoscowTz()) / 1000,
        date: getDateWithMoscowTz(),
      },
    };
  })
);

export const loadTrackCaching = ({ odh_mkad, ...payloadData }) => (
  getCarGpsNumberByDateTime(payloadData as any)
    .then(({ gps_code }) => {
      const payloadToTrack = {
        version: get(JSON.parse(localStorage.getItem(global.API__KEY2)), [config.tracksCaching], ''),
        gps_code,
        from_dt: makeUnixTime(payloadData.date_start),
        to_dt: makeUnixTime(payloadData.date_end),
        sensors: 1,
      };

      return TrackService.get(payloadToTrack).then((ans) => ({
        ...ans,
        ...checkAndModifyTrack(ans, odh_mkad),
      }));
    })
);
