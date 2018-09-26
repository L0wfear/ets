import * as React from 'react';

import BarGeoobjectLegend from 'components/missions/mission/MissionInfoForm/new/tool-bar/geoobject-legend/BarGeoobjectLegend';

const ToolBar: React.SFC<any> = (props) => (
  <div className="tool_bar-wrap">
    <div className="tool_bar">
      <BarGeoobjectLegend {...props} />
    </div>
  </div>
);

export default ToolBar;
