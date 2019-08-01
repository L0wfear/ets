import styled, { css } from 'styled-components';

export const RouteGeoListContainer = styled.div<{ height?: string }>`
  max-height: ${({ height }) => height ? height : '500px'};
  overflow: auto;
`;

export const NameListLineContainer = styled.ul`
  padding-left: 20px;
`;

export const TitleList = styled.div`
  font-size: 15px;
  margin-bottom: 15px;
  font-weight: 800;
`;

const notValidStyle = css`
  background-color: #ff000087;
  border: 1px solid #ff00004a!important;
  color: white!important;
`;

export const LiRouteManual = styled.li<{ isInvalid: boolean }>`
  ${({ isInvalid }) => isInvalid && notValidStyle};
`;
