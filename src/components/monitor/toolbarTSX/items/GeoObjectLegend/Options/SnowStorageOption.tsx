import * as React from 'react';
import { connect } from 'react-redux';

import GeoobjectOptionTemplate from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options/GeoobjectOptionTemplate';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS } from 'constants/geoobjects';
import { toggleGeoobject } from 'redux/modules/toolbar.js';
import { getIsShowSnowStorageGeometry } from 'redux/selectors/toolbar';

const toggleGeoobjectSnowStorage = () => toggleGeoobject(GEOOBJECTS_TYPES.snow_storage);

const DtOption: React.SFC<any> = props =>
  <GeoobjectOptionTemplate isActive={props.isActive} title={GEOOBJECTS_TYPES_LABELS.snow_storage} onClick={props.toggleGeoobjectSnowStorage} />;

export default connect(
  state => ({
    isActive: getIsShowSnowStorageGeometry(state),
  }),
  {
    toggleGeoobjectSnowStorage,
  },
)(DtOption);
