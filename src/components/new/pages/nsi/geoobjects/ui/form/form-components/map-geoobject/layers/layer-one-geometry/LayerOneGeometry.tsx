import * as React from 'react';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import { PropsLayerOneGeometry } from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/layers/layer-one-geometry/LayerOneGeometry.h';
import { renderGeoobjects } from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/layers/layer-one-geometry/utils';

class LayerOneGeometry extends React.PureComponent<PropsLayerOneGeometry, {}> {
  componentDidMount() {
    this.props.addLayer({ id: 'LayerOneGeometry', zIndex: 0 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      renderGeoobjects(this.props.geoobjects, this.props);
      this.centerMapOnFeature();
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.geoobjects !== this.props.geoobjects) {
      this.props.removeFeaturesFromSource(null, true);

      renderGeoobjects(this.props.geoobjects, this.props);
      this.centerMapOnFeature();
    }
  }

  centerMapOnFeature() {
    this.props.centerOn({
      extent: this.props.getOlLayer().getSource().getExtent(),
      opt_options: { padding: [50, 50, 50, 50], maxZoom: 11, duration: 500 },
    });
  }

  singleclick = () => {
    this.centerMapOnFeature();
  };

  componentWillUnmount() {
    this.props.removeLayer();
  }

  render() {
    return <div></div>;
  }
}

export default withLayerProps({
  centerOn: true,
})(LayerOneGeometry);
