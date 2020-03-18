import styled, { css } from 'styled-components';
import { RedOptionsStyle } from 'global-styled/global-styled';

export const RouteGeoListContainer = styled.div<{ height?: string; }>`
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

export const LiRouteManualInvalid = css`
  padding: 5px 10px;
  margin-bottom: 3px;
  border-radius: 3px;
`;

export const LiRouteManual = styled.li<{ isInvalid: boolean; }>`
  ${({ isInvalid }) => isInvalid && RedOptionsStyle};
  ${({ isInvalid }) => isInvalid && LiRouteManualInvalid};
`;
