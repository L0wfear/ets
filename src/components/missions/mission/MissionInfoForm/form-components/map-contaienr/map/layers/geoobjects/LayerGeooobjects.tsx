import * as React from 'react';

import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerPlayPoint,
} from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/geoobjects/LayerGeooobjects.h';
import {
  renderGeoobjects,
} from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/map/layers/geoobjects/utils';
import { GeoJSON } from 'utils/ol';

class LayerPlayPoint extends React.PureComponent<PropsLayerPlayPoint, {}> {
  componentDidMount() {
    this.props.addLayer({ id: 'GeoObject', zIndex: 0 }).then(() => {
      this.props.setDataInLayer('singleclick', null);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.geoobjects !== this.props.geoobjects) {
      this.props.removeFeaturesFromSource(null, true);
      renderGeoobjects(this.props.geoobjects, this.props);

      if (!Object.values(this.props.geoobjects).some((objGeos) => (
        Object.values(objGeos).some(({ frontIsSelected, shape }) => {
          if (frontIsSelected) {
            this.props.centerOn({
              extent: GeoJSON.readGeometry(shape).getExtent(),
              opt_options: { padding: [50, 50, 50, 50], maxZoom: 11, duration: 500 },
            });
            return true;
          }

          return false;
        })
      ))) {
        if (Object.values(this.props.geoobjects).length) {
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
})(LayerPlayPoint);
