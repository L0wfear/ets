import * as React from 'react';
import styled from 'styled-components';
import * as Popover from 'react-bootstrap/lib/Popover';

export const PopoverStyled = styled(Popover)``;

type EtsPopoverProps = any;

const EtsPopover: React.FC<EtsPopoverProps> = React.memo(
  (props) => {
    return (
      <PopoverStyled {...props} />
    );
  },
);

export default EtsPopover;
