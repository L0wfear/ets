import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowOdhGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectOdh = () => toggleGeoobject(GEOOBJECTS_TYPES.odh);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.odh} onClick={props.toggleGeoobjectOdh} />;

export default connect(
  state => ({
    isActive: getIsShowOdhGeometry(state),
  }),
  {
    toggleGeoobjectOdh,
  },
)(DtOption);
