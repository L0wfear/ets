import * as React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

interface IPropsDeltaTableHeader {
  tooltip?: string;
  name: string;
}

const DeltaTableHeader: React.SFC<IPropsDeltaTableHeader> = ({ tooltip, name }) => {
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
        placement="top"
      >
        <Glyphicon
          glyph="info-sign"
        />
      </OverlayTrigger>
    </div>
  );
};

export default DeltaTableHeader;
