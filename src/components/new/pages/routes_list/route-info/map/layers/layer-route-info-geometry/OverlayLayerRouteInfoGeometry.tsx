
import * as React from 'react';
import Overlay from 'components/new/ui/map/overlay/Overlay';

import { PropsOverlayLayerRouteInfoGeometry } from 'components/new/pages/routes_list/route-info/map/layers/layer-route-info-geometry/LayerRouteInfoGeometry.h';
import { RouteInfoOverlayContainer } from 'components/new/pages/routes_list/route-info/map/layers/layer-route-info-geometry/styled/styled';

class OverlayLayerRouteInfoGeometry extends React.PureComponent<PropsOverlayLayerRouteInfoGeometry, any> {
  render() {
    const { props } = this;

    return (
      <Overlay
        title={`${props.type}: ${props.name}`}
        map={props.map}
        coordsMsk={props.coordinate}
        hidePopup={props.hidePopup}
        EtsOverlay={RouteInfoOverlayContainer}
      />
    );
  }
}

export default OverlayLayerRouteInfoGeometry;
