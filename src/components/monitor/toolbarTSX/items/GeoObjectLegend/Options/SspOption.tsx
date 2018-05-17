import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowSspGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectSsp = () => toggleGeoobject(GEOOBJECTS_TYPES.ssp);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.ssp} onClick={props.toggleGeoobjectSsp} />;

export default connect(
  state => ({
    isActive: getIsShowSspGeometry(state),
  }),
  {
    toggleGeoobjectSsp,
  },
)(DtOption);
