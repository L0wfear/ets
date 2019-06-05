import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { getStyleForTrackLine } from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/lines/feature-style';
import OverlayTrackPoint from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/points/OverlayTrackPoint';
import { DivNone } from 'global-styled/global-styled';

type PropsLayerTrackPoints = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  getAllFeatures: ETSCore.Map.InjectetLayerProps.FuncGetAllFeatures,
  track: any[];
  mkad_speed_lim: number;
  speed_lim: number;
  gov_number: string;
  map: Map;
  missionNumber: string | number;
  cars_sensors: object;

  carInfoSetTrackPoint: any;
};

type StateLayerTrackPoints = {
  selectedPoint: void | object;
};

const isMoreThenPermitted = (trackPoint, { mkad_speed_lim, speed_lim }) => {
  const { checkCoordsMsk: { onMkad = false } = {}, speed_avg } = trackPoint;
  const topSpeed = onMkad ? mkad_speed_lim : speed_lim;
  return speed_avg <= topSpeed;
};

class LayerTrackPoints extends React.Component<PropsLayerTrackPoints, StateLayerTrackPoints> {
  state = {
    selectedPoint: null,
  };

  componentDidMount() {
    this.props.addLayer({ id: 'TrackPoints', zIndex: 3, renderMode: 'image' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);
    });
  }

  componentDidUpdate(prevProps) {
    const { track } = this.props;

    if (track !== prevProps.track) {
      if (track && this.props.track.length > 1) {
        this.drawTrackPoints(track);
      } else {
        if (this.state.selectedPoint) {
          this.setState({
            selectedPoint: null,
          });
        }
        this.props.removeFeaturesFromSource(null, true);
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  singleclick = (feature) => {
    const timestamp = (feature as any).getId();
    const selectedPoint = this.props.track.find((point) => point.timestamp === timestamp);

    if (selectedPoint) {
      this.setState({ selectedPoint });
    } else {
      // tslint:disable-next-line
      console.warn(`not find with timestamp = {timestamp}`);
    }
  }

  hidePopup = () => {
    this.setState({
      selectedPoint: null,
    });
  }

  drawTrackPoints(track) {
    for (let index = 0, length = track.length; index < length; index++) {
      const currPoint = track[index];
      const currStatus = isMoreThenPermitted(currPoint, this.props);

      const feature = new Feature({
        geometry: new Point(currPoint.coords_msk),
      });

      feature.setStyle(getStyleForTrackLine(currStatus));
      feature.setId(currPoint.timestamp);
      this.props.addFeaturesToSource(feature);
    }
  }

  render() {
    const { selectedPoint } = this.state;

    return (
      <div>
        {
          selectedPoint ?
          (
            <OverlayTrackPoint
              map={this.props.map}
              gov_number={this.props.gov_number}
              missionNumber={this.props.missionNumber}
              trackPoint={selectedPoint}
              track={this.props.track}
              hidePopup={this.hidePopup}
              cars_sensors={this.props.cars_sensors}
            />
          )
          :
          (
            <DivNone />
          )
        }
      </div>
    );
  }
}

export default withLayerProps({
  zoom: true,
  map: true,
})(LayerTrackPoints);
