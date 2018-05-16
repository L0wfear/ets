import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowPedestrianTunnelExitsGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectPedestrianTunnelExits = () => toggleGeoobject(GEOOBJECTS_TYPES.pedestrian_tunnel_exits);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.pedestrian_tunnel_exits} onClick={props.toggleGeoobjectPedestrianTunnelExits} />;

export default connect(
  state => ({
    isActive: getIsShowPedestrianTunnelExitsGeometry(state),
  }),
  {
    toggleGeoobjectPedestrianTunnelExits,
  },
)(DtOption);
