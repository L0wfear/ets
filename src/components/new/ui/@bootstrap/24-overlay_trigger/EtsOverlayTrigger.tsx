import * as React from 'react';
import styled from 'styled-components';
import * as OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

export const OverlayTriggerStyled = styled(OverlayTrigger)``;

type EtsOverlayTriggerProps = any;

const EtsOverlayTrigger: React.FC<EtsOverlayTriggerProps> = React.memo(
  (props) => {
    return (
      <OverlayTriggerStyled {...props} />
    );
  },
);

export default EtsOverlayTrigger;
