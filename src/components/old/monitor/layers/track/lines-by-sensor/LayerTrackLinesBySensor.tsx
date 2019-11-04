import * as React from 'react';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForTrackLineBySensor } from 'components/old/monitor/layers/track/lines-by-sensor/feature-style';
import { get } from 'lodash';
import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';

type PropsLayerTrackLines = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer;
  getAllFeatures: ETSCore.Map.InjectetLayerProps.FuncGetAllFeatures;
  track: Array<any>;
  lastPoint: any;
  front_cars_sensors_equipment: IStateMonitorPage['carInfo']['trackCaching']['front_cars_sensors_equipment'];
  SHOW_TRACK: boolean;
};

type StateLayerTrackLines = {
};

const countWorkSensor = (trackPoint, front_cars_sensors_equipment) => {
  const pointSensors = get(trackPoint, ['sensors', 'equipment'], []).filter((s) => (
    front_cars_sensors_equipment[s.sensor_id].show && s.val !== 0),
  );

  return pointSensors.length;
};

class LayerTrackLines extends React.PureComponent<PropsLayerTrackLines, StateLayerTrackLines> {
  componentDidMount() {
    this.props.addLayer({ id: 'TrackLinesBySensor', zIndex: 2 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);

      const { track, front_cars_sensors_equipment } = this.props;

      if (track.length > 1) {
        this.drawTrackLines(track, front_cars_sensors_equipment, this.props.SHOW_TRACK);
        this.setState({ lastPoint: this.props.lastPoint, trackLineIsDraw: true });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { SHOW_TRACK } = this.props;

    if (!(prevProps.track.length > 1)) {  // Если трек не было отрисован
      const {
        track,
        front_cars_sensors_equipment,
      } = this.props;

      if (track.length > 1) {
        this.drawTrackLines(track, front_cars_sensors_equipment, SHOW_TRACK);
      }
    } else {
      const {
        track,
        lastPoint,
        front_cars_sensors_equipment,
      } = this.props;

      if (prevProps.front_cars_sensors_equipment !== front_cars_sensors_equipment) {  // Если состояние датчиков навесного оборудования изменилось
        this.props.removeFeaturesFromSource(null, true);
        this.drawTrackLines(track, front_cars_sensors_equipment, SHOW_TRACK);

      } else if (prevProps.lastPoint !== lastPoint) { // если получили новую точку в трек
        this.drawTrackLines(track.slice(-2), front_cars_sensors_equipment, SHOW_TRACK);

      } else if (SHOW_TRACK !== prevProps.SHOW_TRACK) {  //  Если изменился глобавльный флаг отображние трека на карте
        this.changeStyleForLines(SHOW_TRACK);
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

          const feature = new Feature({
            geometry: new LineString(
              linePoints.map(({ coords_msk }) => coords_msk),
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
        const feature = new Feature({
          geometry: new LineString(
            linePoints.map(({ coords_msk }) => coords_msk),
          ),
        });

        feature.set('notSelected', true);
        feature.set('status', lastStatus);
        feature.setStyle(getStyleForTrackLineBySensor(lastStatus, SHOW_TRACK));
        this.props.addFeaturesToSource(feature);
      }
    }
  }

  changeStyleForLines(SHOW_TRACK) {
    this.props.getAllFeatures().forEach((feature) => {
      if (!SHOW_TRACK) {
        feature.setStyle(getStyleForTrackLineBySensor(true, SHOW_TRACK));
      } else {
        feature.setStyle(getStyleForTrackLineBySensor(feature.get('status'), SHOW_TRACK));
      }
    });
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({
  SHOW_TRACK: state.monitorPage.statusGeo.SHOW_TRACK,
  front_cars_sensors_equipment: state.monitorPage.carInfo.trackCaching.front_cars_sensors_equipment,
  track: state.monitorPage.carInfo.trackCaching.track,
  lastPoint: state.monitorPage.carInfo.trackCaching.track === -1 ? false : (state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null),
});

export default compose<any, any>(
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
