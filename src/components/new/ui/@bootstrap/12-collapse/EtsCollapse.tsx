import * as React from 'react';
import styled from 'styled-components';
import * as Collapse from 'react-bootstrap/lib/Collapse';

export const CollapseStyled = styled(Collapse)``;

type EtsCollapseProps = any;

const EtsCollapse: React.FC<EtsCollapseProps> = React.memo(
  (props) => {
    return (
      <CollapseStyled {...props} />
    );
  },
);

export default EtsCollapse;
