import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { extendMoment } from 'moment-range';
import { diffDates, getDateWithMoscowTzByTimestamp, createValidDateTime } from 'components/@next/@utils/dates/dates';
import * as Moment from 'moment';
const moment = extendMoment(Moment);

type PropsDistanceOverSpeedValue = {
  track: any;
  missions: any;
  state_date_end: string;
  state_date_start: string;
};

export const getDistanceValue = (props) => {
  const { track, missions, state_date_start, state_date_end } = props;

  let dist = 0;
  if (missions.length > 0) {
    const dateRange = missions.map((mission) => {
      return {
        date_start: diffDates(state_date_start, mission.date_start) < 0
          ? createValidDateTime(mission.date_start)
          : createValidDateTime(state_date_start),
        date_end: diffDates(mission.date_end, state_date_end) < 0
          ? createValidDateTime(mission.date_end)
          : createValidDateTime(state_date_end),
      };
    });

    for (let index = 0; index < dateRange.length; index++) {
      dist = track.reduce((acc, curr, i) => {
        const pointTimestamp = getDateWithMoscowTzByTimestamp(track[i].timestamp * 1000);
        const range = moment.range(dateRange[index]);
        range.contains(pointTimestamp);
        if (missions[index].speed_limits.speed_lim < track[i].speed_avg && range.contains(pointTimestamp)) {
          // eslint-disable-next-line no-param-reassign
          acc += track[i].distance;
        }
        if (track[i].speed_avg >= 60 && !range.contains(pointTimestamp)) {
          // eslint-disable-next-line no-param-reassign
          acc += track[i].distance;
        }
        return acc;
      }, 0);
    }
  } else {
    dist = track.reduce((acc, curr, i) => {
      if (track[i].speed_avg >= 60) {
        // eslint-disable-next-line no-param-reassign
        acc += track[i].distance;
      }
      return acc;
    }, 0);
  }

  return dist === null ? '---' : (dist / 1000).toFixed(2);
};

const DistanceOverSpeedValue: React.FC<PropsDistanceOverSpeedValue> = (props) => (
  <span>
    <span>{getDistanceValue(props)}</span>
  </span>
);

export default compose<PropsDistanceOverSpeedValue, {}>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
    canNull: true,
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      track: state.monitorPage.carInfo.trackCaching.track,
      missions: state.monitorPage.carInfo.missionsAndWaybillsData.missions,
      state_date_end: state.monitorPage.carInfo.date_end,
      state_date_start: state.monitorPage.carInfo.date_start,
    }),
  ),
)(DistanceOverSpeedValue);
