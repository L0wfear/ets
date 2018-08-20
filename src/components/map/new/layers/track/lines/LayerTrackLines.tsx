import * as React from 'react';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForTrackLine } from 'components/map/new/layers/track/lines/feature-style';

type PropsLayerTrackLines = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  getAllFeatures: ETSCore.Map.InjectetLayerProps.FuncGetAllFeatures,
  track: any[];
  zoom: number,
  lastPoint: any;
  forToday: boolean;
  mkad_speed_lim: number;
  speed_lim: number;
  SHOW_TRACK: boolean;
};

type StateLayerTrackLines = {
  gps_code: number | void;
  zoomMore8: boolean,
  lastPoint: any;
  trackLineIsDraw: boolean;
  SHOW_TRACK: boolean;
};

const isMoreThenPermitted = (trackPoint, { mkad_speed_lim, speed_lim }) => {
  const { checkCoordsMsk: { onMkad = false } = {}, speed_avg } = trackPoint;
  const topSpeed = onMkad ? mkad_speed_lim : speed_lim;
  return speed_avg <= topSpeed;
}
class LayerTrackLines extends React.Component<PropsLayerTrackLines, StateLayerTrackLines> {
  state = {
    gps_code: null,
    zoomMore8: this.props.zoom >= 8,
    lastPoint: null,
    trackLineIsDraw: false,
    SHOW_TRACK: this.props.SHOW_TRACK,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'TrackLines', zIndex: 1 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);

      const { track } = this.props;

      if (track.length > 1) {
        this.drawTrackLines(track, this.state.SHOW_TRACK);
        this.setState({ lastPoint: this.props.lastPoint, trackLineIsDraw: true });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { SHOW_TRACK } = nextProps;

    if (!this.state.trackLineIsDraw) {
      const { track } = nextProps;

      if (track.length > 1) {
        this.drawTrackLines(track, SHOW_TRACK);
        this.setState({ lastPoint: nextProps.lastPoint, trackLineIsDraw: true, SHOW_TRACK });
      }
    } else {
      const { lastPoint, track } = nextProps;

      if (lastPoint !== this.state.lastPoint) {
        // можно оптимизировать и докидывать точку в последнюю "удачную" по цвету геометрию
        this.drawTrackLines(track.slice(-2), SHOW_TRACK)
        this.setState({ lastPoint, SHOW_TRACK });
      } else if (SHOW_TRACK !== this.state.SHOW_TRACK) {
        this.changeStyleForPoint(SHOW_TRACK)
        this.setState({ SHOW_TRACK });
      }
      
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  drawTrackLines(track, SHOW_TRACK) {
    let linePoints = [
      track[0],
    ];

    let lastStatus = isMoreThenPermitted(linePoints[0], this.props);
    let lastTimestatmp = linePoints[0].timestamp;

    for (let index = 1, length = track.length; index < length; index++) {
      const currPoint = track[index];
      const currStatus = isMoreThenPermitted(currPoint, this.props);

      if (currStatus !== lastStatus) {
        linePoints.push(currPoint);

        const feature = new ol.Feature({
          geometry: new ol.geom.LineString(
            linePoints.map(({ coords_msk }) => coords_msk)
          ),
        });

        feature.set('notSelected', true)
        feature.setStyle(getStyleForTrackLine(lastStatus, SHOW_TRACK));
        this.props.addFeaturesToSource(feature);
        feature.setId(lastTimestatmp);
        feature.set('status', lastStatus);
        linePoints = [currPoint];
        lastStatus = currStatus;
        lastTimestatmp = linePoints[0].timestamp;
      } else {
        linePoints.push(currPoint);
      }
    }

    if (linePoints.length > 1) {
      const feature = new ol.Feature({
        geometry: new ol.geom.LineString(
          linePoints.map(({ coords_msk }) => coords_msk)
        ),
      });

      feature.set('notSelected', true)
      feature.setId(lastTimestatmp);
      feature.set('status', lastStatus);

      feature.setStyle(getStyleForTrackLine(lastStatus, SHOW_TRACK));
      this.props.addFeaturesToSource(feature);
    }
  }

  changeStyleForPoint(SHOW_TRACK) {
    this.props.getAllFeatures().forEach(feature => {
      if (!SHOW_TRACK) {
        feature.setStyle(getStyleForTrackLine(true, SHOW_TRACK));
      } else {
        feature.setStyle(getStyleForTrackLine(feature.get('status'), SHOW_TRACK));
      }
    });
  }

  render() {
    return <div></div>
  }
}

const mapStateToProps = state => ({
  SHOW_TRACK: state.monitorPage.statusGeo.SHOW_TRACK,
  gps_code: state.monitorPage.carInfo.gps_code,
  track: state.monitorPage.carInfo.trackCaching.track,
  lastPoint: state.monitorPage.carInfo.trackCaching.track.slice(-1)[0],
  forToday: state.monitorPage.carInfo.forToday,
  mkad_speed_lim: state.monitorPage.carInfo.missionsData.mkad_speed_lim,
  speed_lim: state.monitorPage.carInfo.missionsData.speed_lim,
});

const mapDispatchToProps = dispatch => ({
})

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'track'],
    type: 'none',
  }),
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'missionsData', 'missions'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps({
    zoom: true,
  }),
)(LayerTrackLines);
