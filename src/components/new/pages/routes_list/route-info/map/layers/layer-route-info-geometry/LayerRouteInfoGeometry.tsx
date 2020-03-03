import * as React from 'react';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerPlayPoint,
  StateLayerPLayPoint,
} from 'components/new/pages/routes_list/route-info/map/layers/layer-route-info-geometry/LayerRouteInfoGeometry.h';
import { renderGeoobjects, renderInputLines } from 'components/new/pages/routes_list/route-info/map/layers/layer-route-info-geometry/utils';
import { DivNone } from 'global-styled/global-styled';
import OverlayLayerRouteInfoGeometry from 'components/new/pages/routes_list/route-info/map/layers/layer-route-info-geometry/OverlayLayerRouteInfoGeometry';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

class LayerOneGeometry extends React.PureComponent<PropsLayerPlayPoint, StateLayerPLayPoint> {
  state = {
    selectedGeoobj: null,
  };

  componentDidMount() {
    this.props.addLayer({ id: 'LayerRouteInfoGeometry', zIndex: 0 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      const {
        geoobjectsArr,
        inputLines,
      } = this.props;

      if (inputLines) {
        renderInputLines(this.props.inputLines, this.props);
      }
      if (geoobjectsArr) {
        renderGeoobjects(geoobjectsArr, this.props);
      }
      this.centerMapOnFeature();
    });
  }

  componentDidUpdate(prevProps) {
    const {
      geoobjectsArr,
      inputLines,
    } = this.props;

    if (prevProps.geoobjectsArr !== geoobjectsArr || prevProps.inputLines !== inputLines) {
      this.props.removeFeaturesFromSource(null, true);

      if (inputLines) {
        renderInputLines(this.props.inputLines, this.props);
      }
      if (geoobjectsArr) {
        renderGeoobjects(geoobjectsArr, this.props);
      }

      this.centerMapOnFeature();
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

  singleclick = (feature, eventOl) => {
    const id = feature.getId();
    const objData = this.props.geoobjectsArr.find(({ object_id, customId }) => object_id ?  object_id === id : customId === id);

    if (objData && objData.type && objData.name && objData.type !== 'points') {
      this.setState({
        selectedGeoobj: {
          type: objData.type,
          name: objData.name,
          coordinate: eventOl.coordinate,
        },
      });
    }
  };

  hidePopup = () => {
    this.setState({ selectedGeoobj: null });
  };

  componentWillUnmount() {
    this.props.removeLayer();
  }

  render() {
    const { selectedGeoobj } = this.state;
    return (
      <div>
        {
          selectedGeoobj
            ? (
              <OverlayLayerRouteInfoGeometry
                map={this.props.map}
                hidePopup={this.hidePopup}
                coordinate={selectedGeoobj.coordinate}
                type={GEOOBJECTS_OBJ[selectedGeoobj.type].labelSingl}
                name={selectedGeoobj.name}
              />
            )
            :          (
              <DivNone />
            )
        }
      </div>
    );
  }
}

export default withLayerProps({
  map: true,
  centerOn: true,
})(LayerOneGeometry);
