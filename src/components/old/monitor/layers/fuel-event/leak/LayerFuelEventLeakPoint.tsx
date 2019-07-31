import * as React from 'react';
import Feature from 'ol/Feature';
import Map from 'ol/Map';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForFuelEventLeak} from 'components/old/monitor/layers/fuel-event/leak/feature-style';
import OverlayFuelEventLeakPoint from 'components/old/monitor/layers/fuel-event/leak/OverlayFuelEventLeakPoint';
import { geoJSON } from 'utils/ol';
import { monitorPageSetFuelEventsLeakOverlayData } from 'components/old/monitor/redux-main/models/actions-monitor-page';

type PropsLayerFuelEventLeakPoint = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  zoom: number,
  map: Map;

  leakData: any;
  monitorPageSetFuelEventsLeakOverlayData: any;
};

type StateLayerFuelEventLeakPoint = {
};

class LayerFuelEventLeakPoint extends React.PureComponent<PropsLayerFuelEventLeakPoint, StateLayerFuelEventLeakPoint> {
  componentDidMount() {
    this.props.addLayer({ id: 'FuelEventsLeak', zIndex: 11, renderMode: 'vector' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      this.drawFuelEventsLeakPoints(this.props.leakData);
    });
  }

  componentWillUnmount() {
    this.props.removeLayer();
    this.props.monitorPageSetFuelEventsLeakOverlayData();
  }

  componentDidUpdate(prevProps) {
    const { leakData } = this.props;
    if (prevProps.leakData !== leakData) {
      this.props.removeFeaturesFromSource(null, true);
      this.drawFuelEventsLeakPoints(leakData);
    }
  }

  singleclick = (feature) => {
    const id = (feature as any).getId();
    const leak = this.props.leakData[id];

    if (leak) {
      this.props.monitorPageSetFuelEventsLeakOverlayData(leak);
    }
  }

  drawFuelEventsLeakPoints(leakData) {
    for (const id in leakData) {
      if (id in leakData) {
        const currPoint = leakData[id];

        const feature = new Feature({
          geometry: geoJSON.readGeometry(currPoint.shape),
        });

        feature.setId(id);
        feature.setStyle(getStyleForFuelEventLeak());
        this.props.addFeaturesToSource(feature);
      }
    }
  }

  render() {
    return (
      <div>
        <OverlayFuelEventLeakPoint map={this.props.map} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  leakData: state.monitorPage.fuelEvents.leak.data,
});

const mapDispatchToProps = (dispatch) => ({
  monitorPageSetFuelEventsLeakOverlayData: (overlayData) => (
    dispatch(
      monitorPageSetFuelEventsLeakOverlayData(
        overlayData,
      ),
    )
  ),
});

export default compose<any, any>(
  withShowByProps({
    path: ['monitorPage', 'fuelEvents', 'leak', 'data'],
    type: 'none',
    isObj: true,
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps({
    map: true,
  }),
)(LayerFuelEventLeakPoint);
