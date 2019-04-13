import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';

export const InstectionBlockSelect = styled(Row)<{ disabled?: boolean }>`
  margin-top: 10px;
  margin-bottom: 10px;

  padding: 0 40px;

  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export const SelectLabel = styled(Col)`
  min-width: 100px;
`;

export const SelectField = styled(Col)`
`;
