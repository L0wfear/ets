import * as React from 'react';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForTrackLineBySensor } from 'components/map/new/layers/track/lines-by-sensor/feature-style';
import { get } from 'lodash';

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
  front_cars_sensors_equipment: any[];
  SHOW_TRACK: boolean;
};

type StateLayerTrackLines = {
  zoomMore8: boolean,
  lastPoint: any;
  trackLineIsDraw: boolean;
  SHOW_TRACK: boolean;

  front_cars_sensors_equipment: any[];
};

const countWorkSensor = (trackPoint, front_cars_sensors_equipment) => {
  const pointSensors = get(trackPoint, ['sensors', 'equipment'], []).filter(s => (
    front_cars_sensors_equipment[s.sensor_id].show && s.val !== 0)
  );

  return pointSensors.length;
}
class LayerTrackLines extends React.Component<PropsLayerTrackLines, StateLayerTrackLines> {
  state = {
    zoomMore8: this.props.zoom >= 8,
    lastPoint: null,
    trackLineIsDraw: false,
    front_cars_sensors_equipment: this.props.front_cars_sensors_equipment,
    SHOW_TRACK: this.props.SHOW_TRACK,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'TrackLinesBySensor', zIndex: 2 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);

      const { track, front_cars_sensors_equipment } = this.props;

      if (track.length > 1) {
        this.drawTrackLines(track, front_cars_sensors_equipment, this.state.SHOW_TRACK);
        this.setState({ lastPoint: this.props.lastPoint, trackLineIsDraw: true });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { SHOW_TRACK } = nextProps;

    if (!this.state.trackLineIsDraw) {
      const { track, front_cars_sensors_equipment } = nextProps;

      if (track.length > 1) {
        this.drawTrackLines(track, front_cars_sensors_equipment, SHOW_TRACK);
        this.setState({ lastPoint: nextProps.lastPoint, trackLineIsDraw: true, front_cars_sensors_equipment, SHOW_TRACK });
      }
    } else {
      const { lastPoint, front_cars_sensors_equipment } = nextProps;
      if (this.state.front_cars_sensors_equipment !== front_cars_sensors_equipment) {
        this.props.removeFeaturesFromSource(null, true);

        this.drawTrackLines(nextProps.track, nextProps.front_cars_sensors_equipment, SHOW_TRACK)
        this.setState({ front_cars_sensors_equipment, SHOW_TRACK });
      } else if (lastPoint !== this.state.lastPoint) {
        // можно оптимизировать и докидывать точку в последнюю "удачную" по цвету геометрию
        this.drawTrackLines(nextProps.track.slice(-2), front_cars_sensors_equipment, SHOW_TRACK)
        this.setState({ lastPoint, SHOW_TRACK });
      } else if (SHOW_TRACK !== this.state.SHOW_TRACK) {
        
        this.changeStyleForPoint(SHOW_TRACK);
        this.setState({ SHOW_TRACK });
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  drawTrackLines(track, front_cars_sensors_equipment, SHOW_TRACK) {
    if (Object.values(front_cars_sensors_equipment).some(({ show }) => show)) {
      let linePoints = [
        track[0],
      ];

      let lastStatus = countWorkSensor(linePoints[0], front_cars_sensors_equipment);

      for (let index = 1, length = track.length; index < length; index++) {
        const currPoint = track[index];
        const currStatus = countWorkSensor(currPoint, front_cars_sensors_equipment);

        if (currStatus !== lastStatus) {
          linePoints.push(currPoint);

          const feature = new ol.Feature({
            geometry: new ol.geom.LineString(
              linePoints.map(({ coords_msk }) => coords_msk)
            ),
          });

          feature.set('notSelected', true);
          feature.set('status', lastStatus);
          feature.setStyle(getStyleForTrackLineBySensor(lastStatus, SHOW_TRACK));
          this.props.addFeaturesToSource(feature);

          linePoints = [currPoint];
          lastStatus = currStatus;
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

        feature.set('notSelected', true);
        feature.set('status', lastStatus);
        feature.setStyle(getStyleForTrackLineBySensor(lastStatus, SHOW_TRACK));
        this.props.addFeaturesToSource(feature);
      }
    }
  }

  changeStyleForPoint(SHOW_TRACK) {
    this.props.getAllFeatures().forEach(feature => {
      if (!SHOW_TRACK) {
        feature.setStyle(getStyleForTrackLineBySensor(true, SHOW_TRACK));
      } else {
        feature.setStyle(getStyleForTrackLineBySensor(feature.get('status'), SHOW_TRACK));
      }
    });
  }

  render() {
    return <div></div>
  }
}

const mapStateToProps = state => ({
  SHOW_TRACK: state.monitorPage.statusGeo.SHOW_TRACK,
  front_cars_sensors_equipment: state.monitorPage.carInfo.trackCaching.front_cars_sensors_equipment,
  track: state.monitorPage.carInfo.trackCaching.track,
  lastPoint: state.monitorPage.carInfo.trackCaching.track.slice(-1)[0],
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
    zoom: true,
  }),
)(LayerTrackLines);
