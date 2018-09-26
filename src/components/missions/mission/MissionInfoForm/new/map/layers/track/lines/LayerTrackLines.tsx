import * as React from 'react';
import * as ol from 'openlayers';

import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import { getStyleForTrackLine } from 'components/missions/mission/MissionInfoForm/new/map/layers/track/lines/feature-style';

type PropsLayerTrackLines = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  getAllFeatures: ETSCore.Map.InjectetLayerProps.FuncGetAllFeatures,
  track: any[];
  mkad_speed_lim: number;
  speed_lim: number;
};

type StateLayerTrackLines = {
};

const isMoreThenPermitted = (trackPoint, { mkad_speed_lim, speed_lim }) => {
  const { checkCoordsMsk: { onMkad = false } = {}, speed_avg } = trackPoint;
  const topSpeed = onMkad ? mkad_speed_lim : speed_lim;
  return speed_avg <= topSpeed;
}

class LayerTrackLines extends React.Component<PropsLayerTrackLines, StateLayerTrackLines> {
  componentDidMount() {
    this.props.addLayer({ id: 'TrackLines', zIndex: 1 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);
    });
  }

  componentDidUpdate(prevProps) {
    const { track } = this.props;
    if (track && this.props.track.length > 1 && prevProps.track !== this.props.track) {
      this.drawTrackLines(track);
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  drawTrackLines(track) {
    let linePoints = [
      track[0],
    ];

    let lastStatus = isMoreThenPermitted(linePoints[0], this.props);

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

        feature.set('notSelected', true);
        feature.setStyle(getStyleForTrackLine(lastStatus));
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

      feature.set('notSelected', true)

      feature.setStyle(getStyleForTrackLine(lastStatus));
      this.props.addFeaturesToSource(feature);
    }
  }

  render() {
    return <div></div>
  }
}

export default withLayerProps()(LayerTrackLines);
