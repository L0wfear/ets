import styled from 'styled-components';
import { Col, Row } from 'react-bootstrap';

export const RouteInfoContainerDiv = styled(Row)`
  margin: 10px 0px;
`;

export const RouteNameCol = styled(Col)<{ none?: boolean }>`
  margin-bottom: 10px;
  display: ${({ none }) => none ? 'none' : 'initial'}
`;
