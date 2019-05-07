import * as React from 'react';
import * as Popover from 'react-bootstrap/lib/Popover';
import * as OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

interface IPropsDeltaTableHeader {
  tooltip?: string;
  name: string;
}

const DeltaTableHeader: React.FC<IPropsDeltaTableHeader> = ({ tooltip, name }) => {
  const popover = (
    <Popover id="route-odh-coverage-popover" className="car-usage-report-title__popover">
      {tooltip}
    </Popover>
  );
  return (
    <div>
      <span>{name}</span>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={popover}
        placement="left"
      >
        <Glyphicon
          glyph="info-sign"
        />
      </OverlayTrigger>
    </div>
  );
};

export default DeltaTableHeader;
