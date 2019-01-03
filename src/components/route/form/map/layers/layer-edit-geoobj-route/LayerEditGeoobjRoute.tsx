import * as React from 'react';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerEditGeoobjRoute,
  StateLayerEditGeoobjRoute,
} from 'components/route/form/map/layers/layer-edit-geoobj-route/LayerEditGeoobjRoute.h';
import {
  renderGeoobjects,
} from 'components/route/form/map/layers/layer-edit-geoobj-route/utils';

import { polyState } from 'components/route/form/map/layers/layer-edit-geoobj-route/feature-style';

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
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  centerMapOnFeature() {
    const extent = this.props.getOlLayer().getSource().getExtent();

    if (isFinite(extent[0])) {
      this.props.centerOn({
        extent,
        opt_options: { padding: [50, 50, 50, 50], maxZoom: 13, duration: 500 },
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
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default withLayerProps({
  centerOn: true,
})(LayerEditGeoobjRoute);
