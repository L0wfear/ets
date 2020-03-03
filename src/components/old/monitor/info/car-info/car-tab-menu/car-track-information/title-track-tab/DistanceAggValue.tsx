import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';

type PropsDistanceAggValue = {
  distance: any;
};

export const getDistanceValue = (distance) => {
  return distance === null
    ? '---'
    : (distance / 1000).toFixed(2);
};

const DistanceAggValue: React.FC<PropsDistanceAggValue> = ({ distance }) => (
  <span>
    <span>{getDistanceValue(distance)}</span>
  </span>
);

export default compose<PropsDistanceAggValue, {}>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
    canNull: true,
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      distance: state.monitorPage.carInfo.trackCaching.distance,
    }),
  ),
)(DistanceAggValue);
