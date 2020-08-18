import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForTrackLine } from 'components/old/monitor/layers/track/lines/feature-style';
import OverlayTrackPoint from 'components/old/monitor/layers/track/points/OverlayTrackPoint';
import { carInfoSetTrackPoint } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { ReduxState } from 'redux-main/@types/state';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type PropsLayerTrackPoints = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer;
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById;
  getAllFeatures: ETSCore.Map.InjectetLayerProps.FuncGetAllFeatures;
  track: Array<any>;
  zoom: number;
  lastPoint: any;
  mkad_speed_lim: number;
  speed_lim: number;
  map: Map;
  SHOW_TRACK_POINTS: boolean;

  dispatch: EtsDispatch;
};

type StateLayerTrackPoints = {
  zoomMore8: boolean;
  lastPoint: any;
  trackLineIsDraw: boolean;
  SHOW_TRACK_POINTS: boolean;
};

const isMoreThenPermitted = (trackPoint, { mkad_speed_lim, speed_lim }) => {
  const { checkCoordsMsk: { onMkad = false } = {}, speed_avg } = trackPoint;
  const topSpeed = onMkad ? mkad_speed_lim : speed_lim;

  return speed_avg <= topSpeed;
};

class LayerTrackPoints extends React.PureComponent<PropsLayerTrackPoints, StateLayerTrackPoints> {
  state = {
    zoomMore8: this.props.zoom >= 8,
    lastPoint: null,
    trackLineIsDraw: false,
    SHOW_TRACK_POINTS: this.props.SHOW_TRACK_POINTS,
  };

  componentDidMount() {
    this.props.addLayer({ id: 'TrackPoints', zIndex: 3, renderMode: 'image' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      const { track } = this.props;

      if (track.length > 1) {
        this.drawTrackPoints(track, this.state.SHOW_TRACK_POINTS);
        this.setState({ lastPoint: this.props.lastPoint, trackLineIsDraw: true });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { SHOW_TRACK_POINTS, speed_lim, mkad_speed_lim } = this.props;
    if (!(prevProps.track.length > 1)) {
      const { track } = this.props;
      if (track.length > 1) {
        this.drawTrackPoints(track, SHOW_TRACK_POINTS);
      }
    } else {
      const { lastPoint } = this.props;
      if (lastPoint !== prevProps.lastPoint && lastPoint) {
        this.drawTrackPoints([lastPoint], SHOW_TRACK_POINTS);
      } else if (SHOW_TRACK_POINTS !== prevProps.SHOW_TRACK_POINTS) {
        const { track } = this.props;
        this.changeStyleForPoint(track, SHOW_TRACK_POINTS);
      } else if (speed_lim !== prevProps.speed_lim || mkad_speed_lim !== prevProps.mkad_speed_lim) {
        this.props.removeFeaturesFromSource(null, true);
        this.drawTrackPoints(this.props.track, SHOW_TRACK_POINTS);
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
    this.props.dispatch(carInfoSetTrackPoint());
  }

  singleclick = (feature) => {
    const timestamp = (feature as any).getId();
    const trackPoint = this.props.track.find((point) => point.timestamp === timestamp);

    if (trackPoint) {
      this.props.dispatch(carInfoSetTrackPoint(trackPoint));
    } else {
      // tslint:disable-next-line
      console.warn(`not find with timestamp = {timestamp}`);
    }
  };

  drawTrackPoints(track, SHOW_TRACK_POINTS) {
    for (let index = 0, length = track.length; index < length; index++) {
      const currPoint = track[index];
      const currStatus = isMoreThenPermitted(currPoint, this.props);

      const feature = new Feature({
        geometry: new Point(currPoint.coords_msk),
      });

      feature.setId(currPoint.timestamp);
      feature.set('status', currStatus);
      feature.setStyle(getStyleForTrackLine(currStatus, SHOW_TRACK_POINTS));
      this.props.addFeaturesToSource(feature);
    }
  }

  changeStyleForPoint(track, SHOW_TRACK_POINTS) {
    this.props.getAllFeatures().forEach((feature) => {
      if (!SHOW_TRACK_POINTS) {
        feature.setStyle(getStyleForTrackLine(true, SHOW_TRACK_POINTS));
      } else {
        feature.setStyle(getStyleForTrackLine(feature.get('status'), SHOW_TRACK_POINTS));
      }
    });
  }

  render() {
    return (
      <div>
        <OverlayTrackPoint map={this.props.map} />
      </div>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      SHOW_TRACK_POINTS: state.monitorPage.SHOW_TRACK_POINTS,
      track: state.monitorPage.carInfo.trackCaching.track,
      lastPoint: state.monitorPage.carInfo.trackCaching.track === -1 ? false : (state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null),
      mkad_speed_lim: state.monitorPage.carInfo.missionsAndWaybillsData.mkad_speed_lim,
      speed_lim: state.monitorPage.carInfo.missionsAndWaybillsData.speed_lim,
    }),
  ),
  withLayerProps({
    zoom: true,
    map: true,
  }),
)(LayerTrackPoints);
