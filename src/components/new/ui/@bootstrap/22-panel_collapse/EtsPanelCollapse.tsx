import * as React from 'react';
import styled from 'styled-components';
import * as Panel from 'react-bootstrap/lib/Panel';

export const PanelCollapseStyled = styled(Panel.Collapse)``;

type EtsPanelCollapseProps = any;

const EtsPanelCollapse: React.FC<EtsPanelCollapseProps> = React.memo(
  (props) => {
    return (
      <PanelCollapseStyled {...props} />
    );
  },
);

export default EtsPanelCollapse;
