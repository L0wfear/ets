import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowPedestrianTunnelsGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectPedestrianTunnels = () => toggleGeoobject(GEOOBJECTS_TYPES.pedestrian_tunnels);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.pedestrian_tunnels} onClick={props.toggleGeoobjectPedestrianTunnels} />;

export default connect(
  state => ({
    isActive: getIsShowPedestrianTunnelsGeometry(state),
  }),
  {
    toggleGeoobjectPedestrianTunnels,
  },
)(DtOption);
