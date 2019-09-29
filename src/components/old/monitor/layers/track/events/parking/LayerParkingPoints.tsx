import * as React from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForParking } from 'components/old/monitor/layers/track/events/parking/feature-style';
import OverlayParkingPoint from 'components/old/monitor/layers/track/events/parking/OverlayParkingPoint';
import { carInfoSetParkingPoint } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';

type PropsLayerParkingPoints = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  zoom: number,
  map: Map;

  front_parkings: any;
  carInfoSetParkingPoint: any;
};

type StateLayerParkingPoints = {
};

class LayerParkingPoints extends React.PureComponent<PropsLayerParkingPoints, StateLayerParkingPoints> {
  componentDidMount() {
    this.props.addLayer({ id: 'ParkingPoints', zIndex: 4, renderMode: 'hybrid' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      this.drawTrackPoints(this.props.front_parkings);
    });
  }

  componentWillUnmount() {
    this.props.removeLayer();
    this.props.carInfoSetParkingPoint();
  }

  singleclick = (feature) => {
    const timestamp = (feature as any).getId();

    const parkingPoint = this.props.front_parkings.find((point) => point.start_point.timestamp === timestamp);

    if (parkingPoint) {
      this.props.carInfoSetParkingPoint(parkingPoint);
    } else {
      // tslint:disable-next-line
      console.warn(`not find with timestamp = {timestamp}`);
    }
  }

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
    return (
      <div>
        <OverlayParkingPoint map={this.props.map} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  front_parkings: state.monitorPage.carInfo.trackCaching.front_parkings,
});

const mapDispatchToProps = (dispatch) => ({
  carInfoSetParkingPoint: (parkingPoint) => (
    dispatch(
      carInfoSetParkingPoint(parkingPoint),
    )
  ),
});

export default compose<any, any>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'front_parkings'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps({
    zoom: true,
    map: true,
  }),
)(LayerParkingPoints);
