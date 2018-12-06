import * as React from 'react';

import MissionInfoLegend from 'components/missions/mission/MissionInfoForm/form-components/map-contaienr/tool-bar/mission-info-legend/MissionInfoLegend';

const ToolBar: React.FunctionComponent<any> = (props) => (
  <div className="tool_bar-wrap">
    <div className="tool_bar">
      <MissionInfoLegend {...props} />
    </div>
  </div>
);

export default ToolBar;
