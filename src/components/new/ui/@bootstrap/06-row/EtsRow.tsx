import * as React from 'react';
import styled from 'styled-components';
import * as Row from 'react-bootstrap/lib/Row';

export const RowStyled = styled(Row)``;

type EtsRowProps = any;

const EtsRow: React.FC<EtsRowProps> = React.memo(
  (props) => {
    return (
      <RowStyled {...props} />
    );
  },
);

export default EtsRow;
