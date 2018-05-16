import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowFuelingWaterGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectFuelingWater = () => toggleGeoobject(GEOOBJECTS_TYPES.fueling_water);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.fueling_water} onClick={props.toggleGeoobjectFuelingWater} />;

export default connect(
  state => ({
    isActive: getIsShowFuelingWaterGeometry(state),
  }),
  {
    toggleGeoobjectFuelingWater,
  },
)(DtOption);
