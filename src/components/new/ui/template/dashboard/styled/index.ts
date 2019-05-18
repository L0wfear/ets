import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const TemplateDashboardContainer = styled(EtsPageWrap)`
  opacity: 0.5;
`;

export const MaintTemplateComponent = styled.div`
  border-radius: 10px;
  background-color: grey;
  margin: 5px;
  height: 30px;
`;

export const TemplateDashboardTimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
export const TemplateDashboardData = styled(MaintTemplateComponent)`
  height: 45px;
  width: 200px;
`;
export const TemplateDashboardTime = styled(MaintTemplateComponent)`
  height: 40px;
  width: 300px;
`;
export const TempateDashboardCards = styled(EtsBootstrap.Row)`
  height: 100;
`;

export const TempateDashboardCardWrap = styled(EtsBootstrap.Col).attrs({ md: 3 })`
  padding: 10px;
  height: 300px;
`;

export const TempateDashboardCard = styled(MaintTemplateComponent)`
  height: 270px;
`;
