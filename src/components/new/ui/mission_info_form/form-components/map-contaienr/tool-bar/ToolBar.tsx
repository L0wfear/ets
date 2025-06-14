import * as React from 'react';

import MissionInfoLegend from 'components/new/ui/mission_info_form/form-components/map-contaienr/tool-bar/mission-info-legend/MissionInfoLegend';

const ToolBar: React.FC<any> = (props) => (
  <div className="tool_bar-wrap">
    <div className="tool_bar info">
      <MissionInfoLegend {...props} />
    </div>
  </div>
);

export default ToolBar;
