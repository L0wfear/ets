import * as React from 'react';
import styled from 'styled-components';
import * as Panel from 'react-bootstrap/lib/Panel';

export const PanelStyled = styled(Panel)``;

type EtsPanelProps = any;

const EtsPanel: React.FC<EtsPanelProps> = React.memo(
  (props) => {
    return (
      <PanelStyled {...props} />
    );
  },
);

export default EtsPanel;
