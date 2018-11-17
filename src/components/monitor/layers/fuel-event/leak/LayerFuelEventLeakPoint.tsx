import * as React from 'react';
import Feature from 'ol/Feature';

import withLayerProps from 'components/map/layers/base-hoc/layer/LayerProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { getStyleForFuelEventLeak} from 'components/monitor/layers/fuel-event/leak/feature-style';
import OverlayFuelEventLeakPoint from 'components/monitor/layers/fuel-event/leak/OverlayFuelEventLeakPoint';
import { geoJSON } from 'utils/ol';
import { monitorPageSetFuelEventsLeakOverlayData } from 'components/monitor/redux-main/models/actions-monitor-page';

type PropsLayerFuelEventLeakPoint = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  zoom: number,
  map: ol.Map;

  leakData: any;
  monitorPageSetFuelEventsLeakOverlayData: any;
};

type StateLayerFuelEventLeakPoint = {
};

class LayerFuelEventLeakPoint extends React.Component<PropsLayerFuelEventLeakPoint, StateLayerFuelEventLeakPoint> {
  componentDidMount() {
    this.props.addLayer({ id: 'FuelEventsLeak', zIndex: 11 }).then(() => {
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

export default hocAll(
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
