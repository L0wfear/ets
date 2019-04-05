import styled from 'styled-components';
import { Col, Row } from 'react-bootstrap';

export const FlexRow = styled(Row)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: row-reverse;
`;

export const CenterCol = styled(Col)`
  text-align: center;
`;
