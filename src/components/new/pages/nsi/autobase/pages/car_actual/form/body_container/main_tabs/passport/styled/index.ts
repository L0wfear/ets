import styled from 'styled-components';
import { Col, Row } from 'react-bootstrap';

export const MarginTopRow = styled(Row)`
  margin-top: 20px;
`;

export const FlexRow = styled(MarginTopRow)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: row-reverse;
`;

export const CenterCol = styled(Col)`
  text-align: center;
`;
