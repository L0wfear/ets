import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { connect } from 'react-redux';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';

import { makeFeaute } from 'components/map/new/layers/track/play-point/feature/utils-feature';
import { actionOnPlay, actionOnStop } from 'components/map/new/layers/track/play-point/play-events/utils-play-event';

import { PropsLayerPlayPoint } from 'components/map/new/layers/track/play-point/LayerPlayPoint.h';

class LayerPlayPoint extends React.Component<PropsLayerPlayPoint, {}> {
  componentDidMount() {
    this.props.addLayer({ id: 'PlayPoint', zIndex: 11 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);

      this.props.addFeaturesToSource(
        makeFeaute(),
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playTrackStatus === 'play') {
      actionOnPlay(nextProps);
    }

    if (nextProps.playTrackStatus === 'stop') {
      actionOnStop(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = state => ({
  point: state.monitorPage.carInfo.trackCaching.track[state.monitorPage.carInfo.playTrack.trackPointIndex],
  playTrackStatus: state.monitorPage.carInfo.playTrack.status,
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
  ),
  withLayerProps({
    centerOn: true,
  }),
)(LayerPlayPoint);
