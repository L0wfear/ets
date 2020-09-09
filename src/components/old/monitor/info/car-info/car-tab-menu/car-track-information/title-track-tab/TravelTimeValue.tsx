import * as React from 'react';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getMonitorPageState } from 'redux-main/reducers/selectors';

type PropsTravelTimeValue = {};

const convertUnix = (timestamp: number) => {
  let days, hours, minutes, seconds;
  seconds = timestamp;
  minutes = Math.floor(seconds / 60);
  hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  days = Math.floor(hours / 24);
  hours = hours % 24;

  if (days >= 1) {
    hours += 24 * days;
  }

  return `${hours}:${minutes}`;
};

export const getTimeValue = (track) => {
  let value;

  if (track !== -1) {
    value = track.reduce((acc, curr, i) => {
      if (track[i].speed_avg > 0) {
        if (i === 0) {
          // eslint-disable-next-line no-param-reassign
          return acc;
        } else {
          // eslint-disable-next-line no-param-reassign
          acc += (curr.timestamp - track[i - 1].timestamp);
        }
      }
      return acc;
    }, 0);
  }

  return value === null ? '---' : convertUnix(value);
};

const TravelTimeValue: React.FC<PropsTravelTimeValue> = () => {
  const track = etsUseSelector((state) => getMonitorPageState(state).carInfo.trackCaching.track);
  const [time, setTime] = React.useState(null);

  React.useEffect(() => {
    setTime(getTimeValue(track));
  }, [track]);

  return (
    <span>{time}</span>
  );
};

export default compose<PropsTravelTimeValue, {}>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
    canNull: true,
  }),
)(TravelTimeValue);
