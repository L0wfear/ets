import * as React from 'react';
import {connect} from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import {ReduxState} from 'redux-main/@types/state';
import {compose} from 'recompose';

type PropsTravelTimeValue = {
  track: any;
};

export const getTimeValue = (track) => {
  const value = track.reduce((acc, curr, i) => {
    if (track[i].speed_avg > 0) {
      if (i === 0) {
        // eslint-disable-next-line no-param-reassign
        acc += (track[i + 1].timestamp - curr.timestamp);
      } else {
        // eslint-disable-next-line no-param-reassign
        acc += (curr.timestamp - track[i - 1].timestamp);
      }
    }
    return acc;
  }, 0);

  return value === null ? '---' : `${new Date(value * 1000).getHours()}:${new Date(value * 1000).getMinutes()}`;
};

const TravelTimeValue: React.FC<PropsTravelTimeValue> = ({ track }) => (
  <span>
    <span>{getTimeValue(track)}</span>
  </span>
);

export default compose<PropsTravelTimeValue, {}>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
    canNull: true,
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      track: state.monitorPage.carInfo.trackCaching.track,
    }),
  ),
)(TravelTimeValue);
