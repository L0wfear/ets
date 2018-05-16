import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowBridgesGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectBridges = () => toggleGeoobject(GEOOBJECTS_TYPES.bridges);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.bridges} onClick={props.toggleGeoobjectBridges} />;

export default connect(
  state => ({
    isActive: getIsShowBridgesGeometry(state),
  }),
  {
    toggleGeoobjectBridges,
  },
)(DtOption);
