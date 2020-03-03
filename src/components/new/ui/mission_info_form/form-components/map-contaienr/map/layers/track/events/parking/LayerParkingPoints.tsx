import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { getStyleForParking } from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/events/parking/feature-style';
import OverlayParkingPoint from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/events/parking/OverlayParkingPoint';
import { DivNone } from 'global-styled/global-styled';

type PropsLayerParkingPoints = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer;
  zoom: number;
  map: Map;

  front_parkings: any;
  carInfoSetParkingPoint: any;
};

type StateLayerParkingPoints = {
  parkingPoint: any| void;
};

class LayerParkingPoints extends React.Component<PropsLayerParkingPoints, StateLayerParkingPoints> {
  state = {
    parkingPoint: null,
  };
  componentDidMount() {
    this.props.addLayer({ id: 'ParkingPoints', zIndex: 4 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      this.drawTrackPoints(this.props.front_parkings);
    });
  }

  componentDidUpdate(prevProps) {
    const { front_parkings } = this.props;
    if (front_parkings !== prevProps.front_parkings) {
      this.props.removeFeaturesFromSource(null, true);
      if (this.state.parkingPoint) {
        this.hidePopup();
      }
      this.drawTrackPoints(front_parkings);
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  singleclick = (feature) => {
    const timestamp = (feature as any).getId();

    const parkingPoint = this.props.front_parkings.find((point) => point.start_point.timestamp === timestamp);

    if (parkingPoint) {
      this.setState({ parkingPoint });
    } else {
      // tslint:disable-next-line
      console.warn(`not find with timestamp = {timestamp}`);
    }
  };

  hidePopup = () => {
    this.setState({
      parkingPoint: null,
    });
  };

  drawTrackPoints(front_parkings) {
    for (let index = 0, length = front_parkings.length; index < length; index++) {
      const currPoint = front_parkings[index];

      const feature = new Feature({
        geometry: new Point(currPoint.start_point.coords_msk),
      });

      feature.setId(currPoint.start_point.timestamp);
      feature.setStyle(getStyleForParking());
      this.props.addFeaturesToSource(feature);
    }
  }

  render() {
    const { parkingPoint } = this.state;

    return (
      <div>
        {
          parkingPoint
            ? (
              <OverlayParkingPoint
                map={this.props.map}
                hidePopup={this.hidePopup}
                parkingPoint={parkingPoint}
              />
            )
            :          (
              <DivNone />
            )
        }
      </div>
    );
  }
}

export default  withLayerProps({
  zoom: true,
  map: true,
})(LayerParkingPoints);
