import styled from 'styled-components';
import { Row } from 'react-bootstrap';

export const RouteInfoContainerDiv = styled(Row)`
  margin: 10px 0px;
`;

export const RouteName = styled.div<{ isDisplay?: boolean }>`
  margin-bottom: 10px;
  display: ${({ isDisplay }) => isDisplay ? 'none' : 'initial'}
`;
