import * as React from 'react';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForFuelEvent } from 'components/map/new/layers/track/events/fuel-event/feature-style';
import { carInfoSetFuelEventPoint } from 'components/monitor/new/info/car-info/redux/modules/actions-car-info';
import OverlayFuelEventPoint from 'components/map/new/layers/track/events/fuel-event/OverlayFuelEventPoint';

type PropsLayerFuelEventPoints = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  zoom: number,
  map: ol.Map;

  front_events_list: any[];
  front_cars_sensors_level: any,
  carInfoSetFuelEventPoint: Function;
  fuelEventPoint: any;
};

type StateLayerFuelEventPoints = {
  fuelEventPoint: any;
  front_cars_sensors_level: any;
};

class LayerFuelEventPoints extends React.Component<PropsLayerFuelEventPoints, StateLayerFuelEventPoints> {
  state = {
    fuelEventPoint: this.props.fuelEventPoint,
    front_cars_sensors_level: this.props.front_cars_sensors_level,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'FuelEventPoints', zIndex: 4 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      this.drawTrackPoints(
        this.props.fuelEventPoint,
        this.props.front_events_list,
        this.props.front_cars_sensors_level,
      );
    });
  }
  componentWillReceiveProps(nextProps) {
    const { fuelEventPoint, front_cars_sensors_level} = nextProps;

    if (front_cars_sensors_level !== this.props.front_cars_sensors_level) {
      this.drawTrackPoints(
        fuelEventPoint,
        nextProps.front_events_list,
        front_cars_sensors_level,
      );

      this.setState({ front_cars_sensors_level });
    } else {
      if (fuelEventPoint !== this.state.fuelEventPoint) {
        this.removeOneFuelEventPoint(this.state.fuelEventPoint);
        this.addOneFuelEventPoint(fuelEventPoint);

        this.setState({
          fuelEventPoint,
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
    this.props.carInfoSetFuelEventPoint();
  }

  singleclick = (feature) => {
    const timestamp = (feature as any).getId();
    const parkingPoint = this.props.front_events_list.find(point => point.start_point.timestamp === timestamp);

    if (parkingPoint) {
      this.props.carInfoSetFuelEventPoint(parkingPoint);
    } else {
      console.warn(`not find with timestamp = {timestamp}`);
    }
  }

  addOneFuelEventPoint(fuelEventPoint) {
    if (fuelEventPoint) {
      const featureOld = this.props.getFeatureById(fuelEventPoint.start_point.timestamp);
      if (!featureOld) {
        const feature = new ol.Feature({
          geometry: new ol.geom.Point(fuelEventPoint.start_point.coords_msk),
        });

        feature.setId(fuelEventPoint.start_point.timestamp);
        feature.setStyle(getStyleForFuelEvent(fuelEventPoint.event_type));
        this.props.addFeaturesToSource(feature);
      }
    }
  }

  removeOneFuelEventPoint(fuelEventPoint) {
    if (fuelEventPoint) {
      const featureOld = this.props.getFeatureById(fuelEventPoint.start_point.timestamp);
      
      if (featureOld) {
        this.props.removeFeaturesFromSource(featureOld);
      }
    }
  }

  drawTrackPoints(fuelEventPoint, front_events_list, front_cars_sensors_level) {
    for (let index = 0, length = front_events_list.length; index < length; index++) {
      const currPoint = front_events_list[index];

      if (front_cars_sensors_level[currPoint.sensor_id].show) {
        this.addOneFuelEventPoint(currPoint);
      } else {
        this.removeOneFuelEventPoint(currPoint);
      }
    }

    this.addOneFuelEventPoint(fuelEventPoint);
  }

  render() {
    return (
      <div>
        <OverlayFuelEventPoint map={this.props.map} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  front_cars_sensors_level: state.monitorPage.carInfo.trackCaching.front_cars_sensors_level,
  fuelEventPoint: state.monitorPage.carInfo.popups.fuelEventPoint,
  front_events_list: state.monitorPage.carInfo.trackCaching.front_events_list,
});

const mapDispatchToProps = dispatch => ({
  carInfoSetFuelEventPoint: (parkingPoint) => (
    dispatch(
      carInfoSetFuelEventPoint(parkingPoint),
    )
  )
})

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'front_events_list'],
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
)(LayerFuelEventPoints);
