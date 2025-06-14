import * as React from 'react';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { extendMoment } from 'moment-range';
import { diffDates, getDateWithMoscowTzByTimestamp, createValidDateTime } from 'components/@next/@utils/dates/dates';
import * as Moment from 'moment';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { filterValidPoints } from 'utils/track';

const moment = extendMoment(Moment);

type PropsDistanceOverSpeedValue = {};

export const getDistanceOverSpeedValue = (props) => {
  const { track, missions, state_date_start, state_date_end } = props;

  let dist;
  if (track !== -1) {
    const filteredTrack = filterValidPoints(track);

    if (missions !== -1 && missions.length > 0) {
      const dateRange = missions.map((mission) => {
        return {
          date_start: diffDates(state_date_start, mission.date_start) > 0
            ? createValidDateTime(state_date_start)
            : createValidDateTime(mission.date_start),
          date_end: diffDates(state_date_end, mission.date_end) > 0
            ? createValidDateTime(mission.date_end)
            : createValidDateTime(state_date_end),
        };
      });

      for (let index = 0; index < dateRange.length; index++) {
        dist = filteredTrack.reduce((acc, curr, i) => {
          const pointTimestamp = getDateWithMoscowTzByTimestamp(filteredTrack[i].timestamp * 1000);
          const range = moment.range(dateRange[index].date_start, dateRange[index].date_end);
          range.contains(pointTimestamp);
          if (missions[index].speed_limits.speed_lim < filteredTrack[i].speed_avg && range.contains(pointTimestamp)) {
            // eslint-disable-next-line no-param-reassign
            acc += filteredTrack[i].distance;
          }
          if (filteredTrack[i].speed_avg >= 60 && !range.contains(pointTimestamp)) {
            // eslint-disable-next-line no-param-reassign
            acc += filteredTrack[i].distance;
          }
          return acc;
        }, 0);
      }
    } else {
      dist = filteredTrack.reduce((acc, curr, i) => {
        if (filteredTrack[i].speed_avg >= 60) {
          // eslint-disable-next-line no-param-reassign
          acc += filteredTrack[i].distance;
        }
        return acc;
      }, 0);
    }
  }

  return dist === null ? '---' : (dist / 1000).toFixed(2);
};

const DistanceOverSpeedValue: React.FC<PropsDistanceOverSpeedValue> = () => {
  const track = etsUseSelector((state) => getMonitorPageState(state).carInfo.trackCaching.track);
  const missions = etsUseSelector((state) => getMonitorPageState(state).carInfo.missionsAndWaybillsData.missions);
  const state_date_end = etsUseSelector((state) => getMonitorPageState(state).carInfo.date_end);
  const state_date_start = etsUseSelector((state) => getMonitorPageState(state).carInfo.date_start);
  const [distance, setDistance] = React.useState(null);

  React.useEffect(() => {
    setDistance(getDistanceOverSpeedValue({ track, missions, state_date_end, state_date_start }));
  }, [track]);

  return (
    <span>{distance}</span>
  );
};

export default compose<PropsDistanceOverSpeedValue, {}>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
    canNull: true,
  }),
)(DistanceOverSpeedValue);
