import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowDtGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectDt = () => toggleGeoobject(GEOOBJECTS_TYPES.dt);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.dt} onClick={props.toggleGeoobjectDt} />;

export default connect(
  state => ({
    isActive: getIsShowDtGeometry(state),
  }),
  {
    toggleGeoobjectDt,
  },
)(DtOption);
