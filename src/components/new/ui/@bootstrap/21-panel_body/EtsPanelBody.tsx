import * as React from 'react';
import styled from 'styled-components';
import * as Panel from 'react-bootstrap/lib/Panel';

export const PanelBodyStyled = styled(Panel.Body)``;

type EtsPanelBodyProps = any;

const EtsPanelBody: React.FC<EtsPanelBodyProps> = React.memo(
  (props) => {
    return (
      <PanelBodyStyled {...props} />
    );
  },
);

export default EtsPanelBody;
