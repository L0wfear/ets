import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowMspGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectMsp = () => toggleGeoobject(GEOOBJECTS_TYPES.msp);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.msp} onClick={props.toggleGeoobjectMsp} />;

export default connect(
  state => ({
    isActive: getIsShowMspGeometry(state),
  }),
  {
    toggleGeoobjectMsp,
  },
)(DtOption);
