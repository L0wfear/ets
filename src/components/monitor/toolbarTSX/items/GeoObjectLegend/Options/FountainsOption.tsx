import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowFountainsGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectFountains = () => toggleGeoobject(GEOOBJECTS_TYPES.fountains);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.fountains} onClick={props.toggleGeoobjectFountains} />;

export default connect(
  state => ({
    isActive: getIsShowFountainsGeometry(state),
  }),
  {
    toggleGeoobjectFountains,
  },
)(DtOption);
