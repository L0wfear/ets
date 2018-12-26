import styled from 'styled-components';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';
import * as Col from 'react-bootstrap/lib/Col';

export const DropdownDateEndCol = styled(Col)`
  &&& {
    padding-right: 0;
  }
`;

export const DropdownDateEnd = styled(Dropdown)`
  width: 100%;
  button {
    width: 100%;
    min-height: 38px;
  }
`;

export const TimeDevider = styled.div`
  width: 10px;
  height: 38px;
  display: flex;
  align-items: center;
`;
