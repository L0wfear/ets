import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const RouteInfoContainerDiv = styled(EtsBootstrap.Row)`
  margin: 10px -15px;
`;

export const RouteName = styled.div<{ isDisplay?: boolean }>`
  margin-bottom: 10px;
  display: ${({ isDisplay }) => !isDisplay ? 'none' : 'initial'}
`;
