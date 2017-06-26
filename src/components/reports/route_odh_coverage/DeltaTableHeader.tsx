import * as React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';

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
    <OverlayTrigger
      trigger={['hover', 'focus']}
      overlay={popover}
      placement="top"
    >
      <span>{name}</span>
    </OverlayTrigger>
  );
};

export default DeltaTableHeader;
