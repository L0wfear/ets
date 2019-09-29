import * as React from 'react';

import { compose } from 'recompose';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { connect } from 'react-redux';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import { makeFeaute } from 'components/old/monitor/layers/track/play-point/feature/utils-feature';
import {
  actionOnPlay,
  actionOnStop,
} from 'components/old/monitor/layers/track/play-point/play-events/utils-play-event';

import { PropsLayerPlayPoint } from 'components/old/monitor/layers/track/play-point/LayerPlayPoint.h';

class LayerPlayPoint extends React.PureComponent<PropsLayerPlayPoint, {}> {
  componentDidMount() {
    this.props
      .addLayer({ id: 'PlayPoint', zIndex: 11, renderMode: 'hybrid' })
      .then(() => {
        this.props.setDataInLayer('singleclick', undefined);

        this.props.addFeaturesToSource(makeFeaute());
      });
  }

  componentDidUpdate(prevProps) {
    const { playTrackStatus } = this.props;

    if (playTrackStatus === 'play') {
      actionOnPlay(this.props);
    }

    if (playTrackStatus === 'stop') {
      actionOnStop(this.props);
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => ({
  point:
    state.monitorPage.carInfo.trackCaching.track[
      state.monitorPage.carInfo.playTrack.trackPointIndex
    ],
  playTrackStatus: state.monitorPage.carInfo.playTrack.status,
});

export default compose<any, any>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'none',
  }),
  connect(mapStateToProps),
  withLayerProps({
    centerOn: true,
  }),
)(LayerPlayPoint);
