import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowPgmStoreGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectPgmStore = () => toggleGeoobject(GEOOBJECTS_TYPES.pgm_store);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.pgm_store} onClick={props.toggleGeoobjectPgmStore} />;

export default connect(
  state => ({
    isActive: getIsShowPgmStoreGeometry(state),
  }),
  {
    toggleGeoobjectPgmStore,
  },
)(DtOption);
