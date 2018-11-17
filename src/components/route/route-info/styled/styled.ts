import styled from 'styled-components';

export const RouteInfoContainerDiv = styled.div`
  margin: 10px 0px;
`;

export const RouteNameDiv = styled.div<{ none?: boolean }>`
  display: ${({ none }) => none ? 'none' : 'initial'}
`;
