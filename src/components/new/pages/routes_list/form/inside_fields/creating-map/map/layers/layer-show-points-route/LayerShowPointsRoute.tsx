import * as React from 'react';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerLayerShowPointsRoute,
  StateLayerLayerShowPointsRoute,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-show-points-route/LayerShowPointsRoute.h';
import {
  renderGeoobjects,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-show-points-route/utils';

class LayerShowPointsRoute extends React.PureComponent<PropsLayerLayerShowPointsRoute, StateLayerLayerShowPointsRoute> {
  componentDidMount() {
    this.props.addLayer({ id: 'LayerShowPointsRoute', zIndex: 1 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);

      const {
        objectList,
      } = this.props;

      if (objectList && objectList.length) {
        renderGeoobjects(objectList, this.props);
        this.centerMapOnFeature();
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      objectList,
    } = this.props;

    if (prevProps.objectList !== objectList) {
      this.props.removeFeaturesFromSource(null, true);

      if (objectList && objectList.length) {
        renderGeoobjects(objectList, this.props);
      }
    }
  }

  centerMapOnFeature() {
    const extent = this.props.getOlLayer().getSource().getExtent();

    if (isFinite(extent[0])) {
      setImmediate(() => {
        this.props.centerOn({
          extent,
          opt_options: { padding: [50, 50, 50, 50], maxZoom: 13 },
        });
      });
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

export default withLayerProps({
  centerOn: true,
})(LayerShowPointsRoute);
