import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';

export const TemplateMonitorContainer = styled(EtsPageWrap)`
  opacity: 0.5;
  background-color: grey;
  height: 100%;
  padding: 10px;
`;

export const TemplateMonitorWrap = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
`;

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
