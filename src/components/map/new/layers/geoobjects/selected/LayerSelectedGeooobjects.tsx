import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import { getCasheStyleForGeoobject } from 'components/map/new/layers/geoobjects/feature-style';
import { GeoJSON } from 'utils/ol';
import { monitorPageRemoveFromSelectedGeoobjects } from 'components/monitor/new/redux/models/actions-monitor-page';

type PropsLayerPlayPoint = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  hideFeatures: ETSCore.Map.InjectetLayerProps.FuncHideFeatures,
  geoobjects: any;

  monitorPageRemoveFromSelectedGeoobjects: Function;
}

type StateLayerPlayPoint = {
}

class LayerPlayPoint extends React.Component<PropsLayerPlayPoint, StateLayerPlayPoint> {
  componentDidMount() {
    this.props.addLayer({ id: 'GeoObject', zIndex: 1 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      this.renderGeoobjects(this.props.geoobjects);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { geoobjects } = nextProps;

    this.renderGeoobjects(geoobjects);
    this.setState({
      geoobjects,
    });
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  singleclick = (feature: ol.Feature) => {
    this.props.monitorPageRemoveFromSelectedGeoobjects(
      feature.get('serverName'),
      feature.getId()
    );
  }

  renderGeoobjects(geoobjectsForRender) {
    Object.entries(geoobjectsForRender).forEach(([serverName, data]) => {
      for(let id in data) {
        const geoobj = data[id];
        const oldFeature = this.props.getFeatureById(id);

        if (geoobj.front_show) {
          if (oldFeature) {
            if (oldFeature.get('shape') !== geoobj.shape) {
              this.props.removeFeaturesFromSource(oldFeature);
              const feature = new ol.Feature({
                geometry: GeoJSON.readGeometry(geoobj.shape),
              });
              feature.setId(id);
              feature.set('serverName', serverName)
              feature.set('shape', geoobj.shape);
              feature.setStyle(getCasheStyleForGeoobject(true));

              this.props.addFeaturesToSource(feature);
            }
          } else {
            const feature = new ol.Feature({
              geometry: GeoJSON.readGeometry(geoobj.shape),
            });
            feature.setId(id);
            feature.set('serverName', serverName)
            feature.set('shape', geoobj.shape);
            feature.setStyle(getCasheStyleForGeoobject(true));

            this.props.addFeaturesToSource(feature);
          }
        } else if (oldFeature) {
          this.props.removeFeaturesFromSource(oldFeature);
        }
      }
    });
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = state => ({
  geoobjects: state.monitorPage.selectedGeoobjects,
});
const mapDispatchToProps = dispatch => ({
  monitorPageRemoveFromSelectedGeoobjects: (serverName, id) => (
    dispatch(
      monitorPageRemoveFromSelectedGeoobjects(
        serverName,
        id,
      )
    )
  )
});

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps(),
)(LayerPlayPoint);
