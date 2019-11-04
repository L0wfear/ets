import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const TemplateRouteContainer = styled(EtsPageWrap)`
  opacity: 0.5;
  height: 100%;
  padding: 0;
`;

export const TemplateRouteWrap = styled(EtsBootstrap.Row)`
  display: flex;
  justify-content: space-between;
  height: 100%;
`;

export const TemplateRouteListTree = styled(EtsBootstrap.Col).attrs({ xs: 5, md: 3 })`
  background-color: grey;
`;

export const TemplateRouteData = styled(EtsBootstrap.Col).attrs({ xs: 7, md: 9 })``;

export const MaintTemplateComponent = styled.div<{ width?: number; height?: number; }>`
  border-radius: 10px;
  border: 10px solid white;
  background-color: white;
  margin: 10px;

  width: ${({ width }) => width || 200}px;
  height: ${({ height }) => height || 50}px;
`;
export const TemplateBlockMenu = styled.div``;
export const TemplateBlockButtons = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
export const TemplateBlockData = styled(MaintTemplateComponent)``;
export const TemplateBlockDataGrey = styled.div`
  border-radius: 10px;
  border: 10px solid grey;
  background-color: grey;
  margin: 10px;

  height: 50px;
`;
