import * as React from 'react';
import styled from 'styled-components';
import * as Col from 'react-bootstrap/lib/Col';

export const ColStyled = styled(Col)``;

type EtsColProps = any;

const EtsCol: React.FC<EtsColProps> = React.memo(
  (props) => {
    return (
      <ColStyled {...props} />
    );
  },
);

export default EtsCol;
