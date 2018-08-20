import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';
import { getCasheStyleForGeoobject } from 'components/map/new/layers/geoobjects/feature-style';
import { GeoJSON } from 'utils/ol';
import { monitorPageAddToSelectedGeoobjects } from 'components/monitor/new/redux/models/actions-monitor-page';

type PropsLayerPlayPoint = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  hideFeatures: ETSCore.Map.InjectetLayerProps.FuncHideFeatures,
  geoobjects: any;
  SHOW_GEOOBJECTS: boolean;

  monitorPageAddToSelectedGeoobjects: Function;
}

type StateLayerPlayPoint = {
  geoobjects: any,
  SHOW_GEOOBJECTS: boolean;
}

class LayerPlayPoint extends React.Component<PropsLayerPlayPoint, StateLayerPlayPoint> {
  state = {
    geoobjects: this.props.geoobjects,
    SHOW_GEOOBJECTS: this.props.SHOW_GEOOBJECTS,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'GeoObject', zIndex: 0 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      this.renderGeoobjects(this.state.geoobjects);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { geoobjects, SHOW_GEOOBJECTS } = nextProps;
    let hasDiff = false;
    let diffGeoobjects = {};

    diffGeoobjects = Object.entries(geoobjects).reduce((newObj, [serverName, data]) => {
      const show = SHOW_GEOOBJECTS && data.show;
      const stateData = this.state.geoobjects[serverName];


      if (show !== stateData.show) {
        if (!show) {
          hasDiff = true;
          newObj[serverName] = {
            show,
            data: data.data,
            oldData: this.state.geoobjects[serverName].data,
          };
        } else {
          hasDiff = true;
          newObj[serverName] = {
            show,
            data: data.data,
            oldData: {},
          };
        }
      }
      if (data.data !== stateData.data) {
        hasDiff = true;
        newObj[serverName] = {
          show,
          data: data.data,
          oldData: this.state.geoobjects[serverName].data,
        };
      }
      
     
      return newObj;
    }, {});

    
    if (hasDiff) {
      this.renderGeoobjects(diffGeoobjects);
      this.setState({
        geoobjects: {
          ...this.state.geoobjects,
          ...Object.entries(geoobjects).reduce(({ ...newObj }, [serverName, data]) => {
            if (diffGeoobjects[serverName]) {

              newObj[serverName] = {
                ...data,
                ...diffGeoobjects[serverName],
              }
            }
  
            return newObj;
          }, {})
        },
        SHOW_GEOOBJECTS,
      });
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  singleclick = (feature: ol.Feature) => {
    const serverName = feature.get('serverName');
    const id = feature.getId();

    this.props.monitorPageAddToSelectedGeoobjects(
      serverName,
      id,
      this.state.geoobjects[serverName].data[id],
    )
  }

  renderGeoobjects(geoobjectsForRender) {
    Object.entries(geoobjectsForRender).forEach(([serverName, { show, data, oldData }]) => {
      for(let id in (data || oldData)) {

        const oldFeature = this.props.getFeatureById(id);

        if (show) {
          const geoobj = data[id];

          if (oldFeature) {
            if (oldFeature.get('shape') !== geoobj.shape) {
              this.props.removeFeaturesFromSource(oldFeature);
              const feature = new ol.Feature({
                geometry: GeoJSON.readGeometry(geoobj.shape),
              });
              feature.setId(id);
              feature.set('serverName', serverName)
              feature.set('shape', geoobj.shape);
              feature.setStyle(getCasheStyleForGeoobject(false));

              this.props.addFeaturesToSource(feature);
            }
          } else {
            const feature = new ol.Feature({
              geometry: GeoJSON.readGeometry(geoobj.shape),
            });
            feature.setId(id);
            feature.set('serverName', serverName)
            feature.set('shape', geoobj.shape);
            feature.setStyle(getCasheStyleForGeoobject(false));

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
  geoobjects: state.monitorPage.geoobjects,
  SHOW_GEOOBJECTS: state.monitorPage.statusGeo.SHOW_GEOOBJECTS,
});
const mapDispatchToProps = dispatch => ({
  monitorPageAddToSelectedGeoobjects: (serverName, id, data) => (
    dispatch(
      monitorPageAddToSelectedGeoobjects(
        serverName,
        id,
        data,
      ),
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
