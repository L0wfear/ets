import * as React from 'react';

import withLayerProps from 'components/map/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerBridgesRoute,
  StateLayerBridgesRoute,
} from 'components/route_new/form/inside_fields/creating-map/map/layers/layer-bridges-route/LayerBridgesRoute.h';
import {
  renderGeoobjects,
} from 'components/route_new/form/inside_fields/creating-map/map/layers/layer-bridges-route/utils';

import { isObject } from 'util';

class LayerBridgesRoute extends React.PureComponent<PropsLayerBridgesRoute, StateLayerBridgesRoute> {
  componentDidMount() {
    this.props.addLayer({ id: 'layerBridgesRoute', zIndex: 1 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);
      const { bridges } = this.props;

      if (isObject(bridges)) {
        renderGeoobjects(bridges, this.props);
      }
    });
  }

  componentDidUpdate(prevProps) {
    this.props.removeFeaturesFromSource(null, true);
    const {
      bridges,
    } = this.props;

    if (prevProps.bridges !== bridges) {
      this.props.removeFeaturesFromSource(null, true);
      if (isObject(bridges)) {
        renderGeoobjects(bridges, this.props);
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default withLayerProps()(LayerBridgesRoute);
