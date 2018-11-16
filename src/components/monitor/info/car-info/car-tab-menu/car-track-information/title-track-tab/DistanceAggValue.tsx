import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

type PropsDistanceAggValue = {
  distance: any;
};

const DistanceAggValue: React.SFC<PropsDistanceAggValue> = ({ distance }) => (
    <span>
    {
      distance === null
      ? (
        <span>{'---'}</span>
      )
      : (
        <span>{distance / 1000}</span>
      )
    }
    </span>
);

const mapStateToProps = state => ({
  distance: state.monitorPage.carInfo.trackCaching.distance,
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'small-loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
    canNull: true,
  }),
  connect(
    mapStateToProps,
  )
)(DistanceAggValue);
