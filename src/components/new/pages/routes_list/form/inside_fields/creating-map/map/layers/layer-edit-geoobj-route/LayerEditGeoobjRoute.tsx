import * as React from 'react';
import * as extent from 'ol/extent';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerEditGeoobjRoute,
  StateLayerEditGeoobjRoute,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-edit-geoobj-route/LayerEditGeoobjRoute.h';
import {
  renderGeoobjects,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-edit-geoobj-route/utils';

import { polyState } from 'constants/polygons';

const countPolyState = Object.values(polyState).length;

class LayerEditGeoobjRoute extends React.PureComponent<PropsLayerEditGeoobjRoute, StateLayerEditGeoobjRoute> {
  componentDidMount() {
    this.props.addLayer({ id: 'LayerEditGeoobjRoute', zIndex: 10 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);
      const {
        geoobjects,
      } = this.props;

      if (geoobjects) {
        renderGeoobjects(geoobjects, this.props);
        this.centerMapOnFeature();
      }
    });
  }

  componentDidUpdate(prevProps) {
    this.props.removeFeaturesFromSource(null, true);
    const {
      geoobjects,
    } = this.props;

    if (prevProps.geoobjects !== geoobjects) {
      if (geoobjects) {
        renderGeoobjects(geoobjects, this.props);
      } else {
        this.props.removeFeaturesFromSource(null, true);
      }
    }

    if (this.props.focusOnSelectedGeo) {
      const selectedGeo = Object.entries(geoobjects).filter(
        ([id, geo]) => geo.state !== polyState.ENABLE,
      );
      if (selectedGeo.length) {

        const featExtent = this.props.getFeatureById(selectedGeo[0][0]).getGeometry().getExtent();
        selectedGeo.forEach(
          ([id]) => {
            extent.extend(featExtent, this.props.getFeatureById(id).getGeometry().getExtent());
          },
        );

        if (isFinite(featExtent[0])) {
          setImmediate(() => {
            this.props.centerOn({
              extent: featExtent,
              opt_options: { padding: [50, 50, 50, 50], maxZoom: 13 },
            });
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  centerMapOnFeature() {
    const extentSource = this.props.getOlLayer().getSource().getExtent();

    if (isFinite(extentSource[0])) {
      setImmediate(() => {
        this.props.centerOn({
          extent: extentSource,
          opt_options: { padding: [50, 50, 50, 50], maxZoom: 13 },
        });
      });
    }
  }

  singleclick = (feature, eventOl) => {
    const id = feature.getId();
    const objData = this.props.geoobjects[id];

    const newState = objData.state + 1;

    if (objData) {
      this.props.handleFeatureClick({
        ...objData,
        id,
        state: newState > countPolyState ? 1 : newState,
      });
    }
  };

  render() {
    return null;
  }
}

export default withLayerProps({
  centerOn: true,
})(LayerEditGeoobjRoute);
