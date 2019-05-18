import * as React from 'react';
import * as OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import EtsBootstrap from 'components/new/ui/@bootstrap';

interface IPropsDeltaTableHeader {
  tooltip?: string;
  name: string;
}

const DeltaTableHeader: React.FC<IPropsDeltaTableHeader> = ({ tooltip, name }) => {
  const popover = (
    <EtsBootstrap.Popover id="route-odh-coverage-popover" className="car-usage-report-title__popover">
      {tooltip}
    </EtsBootstrap.Popover>
  );
  return (
    <div>
      <span>{name}</span>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={popover}
        placement="left"
      >
        <EtsBootstrap.Glyphicon
          glyph="info-sign"
        />
      </OverlayTrigger>
    </div>
  );
};

export default DeltaTableHeader;
