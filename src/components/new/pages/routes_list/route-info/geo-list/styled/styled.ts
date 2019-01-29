import styled from 'styled-components';

export const RouteGeoListContainer = styled.div<{ height?: string }>`
  max-height: ${({ height }) => height ? height : '500px'};
  overflow: scroll;
`;

export const NameListLineContainer = styled.ul`
  padding-left: 20px;
`;

export const TitleList = styled.div`
  font-size: 15px;
  margin-bottom: 15px;
  font-weight: 800;
`;
