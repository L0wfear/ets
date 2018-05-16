import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowDangerZoneGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectDangerZone = () => toggleGeoobject(GEOOBJECTS_TYPES.danger_zone);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.danger_zone} onClick={props.toggleGeoobjectDangerZone} />;

export default connect(
  state => ({
    isActive: getIsShowDangerZoneGeometry(state),
  }),
  {
    toggleGeoobjectDangerZone,
  },
)(DtOption);
