import * as React from 'react';
import styled from 'styled-components';
import * as Table from 'react-bootstrap/lib/Table';

export const TableStyled = styled(Table)``;

export type EtsTableOldProps = any;

const EtsTableOld: React.FC<EtsTableOldProps> = React.memo(
  (props) => {
    return (
      <TableStyled {...props} />
    );
  },
);

export default EtsTableOld;
