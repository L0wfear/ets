import * as React from 'react';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerLayerMissionGeoobject,
} from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/geoobjects/LayerMissionGeoobject.h';
import {
  renderGeoobjects,
  renderInputLines,
} from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/geoobjects/utils';
import { geoJSON } from 'utils/ol';

class LayerMissionGeoobject extends React.PureComponent<PropsLayerLayerMissionGeoobject, {}> {
  componentDidMount() {
    this.props.addLayer({ id: 'GeoObject', zIndex: 0 }).then(() => {
      this.props.setDataInLayer('singleclick', null);
    });
  }

  componentDidUpdate(prevProps) {
    const {
      geoobjects,
      inputLines,
    } = this.props;

    if (prevProps.geoobjects !== geoobjects || prevProps.inputLines !== inputLines) {
      this.props.removeFeaturesFromSource(null, true);
      renderGeoobjects(geoobjects, this.props);
      renderInputLines(inputLines, this.props);

      if (!Object.values(geoobjects).some((objGeos) => (
        Object.values(objGeos).some(({ frontIsSelected, shape }) => {
          if (frontIsSelected) {
            this.props.centerOn({
              extent: geoJSON.readGeometry(shape).getExtent(),
              opt_options: { padding: [50, 50, 50, 50], maxZoom: 11, duration: 500 },
            });
            return true;
          }

          return false;
        })
      ))) {
        if (Object.values(geoobjects).length) {
          this.props.centerOn({
            extent: this.props.getOlLayer().getSource().getExtent(),
            opt_options: { padding: [50, 50, 50, 50], maxZoom: 9, duration: 500 },
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  render() {
    return <div></div>;
  }
}

export default withLayerProps({
  centerOn: true,
})(LayerMissionGeoobject);
