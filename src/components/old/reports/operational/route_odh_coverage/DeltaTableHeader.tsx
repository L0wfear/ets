import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

type IPropsDeltaTableHeader = {
  tooltip?: string;
  name: React.ReactNode;
};

const DeltaTableHeader: React.FC<IPropsDeltaTableHeader> = ({ tooltip, name }) => {
  const popover = (
    <EtsBootstrap.Popover id="route-odh-coverage-popover" className="car-usage-report-title__popover">
      {tooltip}
    </EtsBootstrap.Popover>
  );
  return (
    <div>
      <span>{name}</span>
      <EtsBootstrap.OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={popover}
        placement="top"
      >
        <EtsBootstrap.Glyphicon
          glyph="info-sign"
        />
      </EtsBootstrap.OverlayTrigger>
    </div>
  );
};

export default DeltaTableHeader;
