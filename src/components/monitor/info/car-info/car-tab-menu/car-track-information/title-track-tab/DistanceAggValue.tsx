import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

type PropsDistanceAggValue = {
  distance_agg2: any;
};

const DistanceAggValue: React.SFC<PropsDistanceAggValue> = ({ distance_agg2 }) => (
    <span>
    {
      distance_agg2 === null
      ? (
        <span>{'---'}</span>
      )
      : (
        <span>{distance_agg2 / 1000}</span>
      )
    }
    </span>
);

const mapStateToProps = state => ({
  distance_agg2: state.monitorPage.carInfo.trackCaching.distance_agg2,
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
