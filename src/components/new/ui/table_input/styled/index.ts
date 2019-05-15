import styled from 'styled-components';
import { Button } from 'react-bootstrap';

export const ButtonTableInput = styled(Button)<{ width: number }>`
  &&& {
    width: ${({ width }) => width ? `${width}px` : 'initial'};
  }
`;
