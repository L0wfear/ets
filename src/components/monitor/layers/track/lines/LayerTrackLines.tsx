import * as React from 'react';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';

import withLayerProps from 'components/map/layers/base-hoc/layer/LayerProps';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForTrackLine } from 'components/monitor/layers/track/lines/feature-style';

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
  front_cars_sensors_equipment: any[];
};

type StateLayerTrackLines = {
};

const isMoreThenPermitted = (trackPoint, { mkad_speed_lim, speed_lim }) => {
  const { checkCoordsMsk: { onMkad = false } = {}, speed_avg } = trackPoint;
  const topSpeed = onMkad ? mkad_speed_lim : speed_lim;
  return speed_avg <= topSpeed;
};

class LayerTrackLines extends React.Component<PropsLayerTrackLines, StateLayerTrackLines> {
  componentDidMount() {
    this.props.addLayer({ id: 'TrackLines', zIndex: 1 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);
      const { track } = this.props;
      if (track.length > 1) {
        const isChecked = Object.values(this.props.front_cars_sensors_equipment)
          .some(({ show }) => show);

        this.drawTrackLines(track, this.props.SHOW_TRACK, isChecked);
        this.setState({ lastPoint: this.props.lastPoint, trackLineIsDraw: true });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      SHOW_TRACK,
      track,
      lastPoint,
      front_cars_sensors_equipment,
    } = this.props;

    const newIsChecked = Object.values(front_cars_sensors_equipment)
      .some(({ show }) => show);

    const oldIsChecked = Object.values(prevProps.front_cars_sensors_equipment)
      .some(({ show }) => show);

    if (track !== prevProps.track) {
      if (!prevProps.track || prevProps.track.length < 2) {
        this.drawTrackLines(track, SHOW_TRACK, newIsChecked);
      } else if (lastPoint !== prevProps.track) {
        this.drawTrackLines(track.slice(-2), SHOW_TRACK, newIsChecked);
      }
    }

    if (oldIsChecked !== newIsChecked || SHOW_TRACK !== prevProps.SHOW_TRACK)  {
      this.changeStyleForLines(SHOW_TRACK, newIsChecked);
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  drawTrackLines(track, SHOW_TRACK, equipmentChecked?: boolean) {
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
        const feature = new Feature({
          geometry: new LineString(
            linePoints.map(({ coords_msk }) => coords_msk),
          ),
        });

        feature.set('notSelected', true);
        feature.setStyle(getStyleForTrackLine(lastStatus, SHOW_TRACK, equipmentChecked));
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
      const feature = new Feature({
        geometry: new LineString(
          linePoints.map(({ coords_msk }) => coords_msk),
        ),
      });

      feature.set('notSelected', true);
      feature.setId(lastTimestatmp);
      feature.set('status', lastStatus);

      feature.setStyle(getStyleForTrackLine(lastStatus, SHOW_TRACK, equipmentChecked));
      this.props.addFeaturesToSource(feature);
    }
  }

  changeStyleForLines(SHOW_TRACK, equipmentChecked?) {
    this.props.getAllFeatures().forEach((feature) => {
      if (!SHOW_TRACK) {
        feature.setStyle(getStyleForTrackLine(true, SHOW_TRACK, equipmentChecked));
      } else {
        feature.setStyle(getStyleForTrackLine(feature.get('status'), SHOW_TRACK, equipmentChecked));
      }
    });
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({
  SHOW_TRACK: state.monitorPage.statusGeo.SHOW_TRACK,
  track: state.monitorPage.carInfo.trackCaching.track,
  lastPoint: state.monitorPage.carInfo.trackCaching.track.slice(-1)[0],
  forToday: state.monitorPage.carInfo.forToday,
  mkad_speed_lim: state.monitorPage.carInfo.missionsData.mkad_speed_lim,
  speed_lim: state.monitorPage.carInfo.missionsData.speed_lim,
  front_cars_sensors_equipment: state.monitorPage.carInfo.trackCaching.front_cars_sensors_equipment,
});

const mapDispatchToProps = (dispatch) => ({
});

// рендериться пустой div, компонент не маунтиться, если нет в сторе path, указанного ниже (Lodash)
export default compose<any, any>(
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
  withLayerProps({}),
)(LayerTrackLines);
