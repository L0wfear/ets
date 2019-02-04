import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import {
  TemplateDashboardContainer,
  TemplateDashboardTimerContainer,
  TemplateDashboardData,
  TemplateDashboardTime,
  TempateDashboardCards,
  TempateDashboardCardWrap,
  TempateDashboardCard,
} from './styled';

export default React.memo(
  () => (
    <>
      <LoadingComponent />
      <TemplateDashboardContainer>
        <TemplateDashboardTimerContainer>
          <TemplateDashboardData />
          <TemplateDashboardTime />
        </TemplateDashboardTimerContainer>
        <TempateDashboardCards>
          <TempateDashboardCardWrap>
            <TempateDashboardCard />
          </TempateDashboardCardWrap>
          <TempateDashboardCardWrap>
            <TempateDashboardCard />
          </TempateDashboardCardWrap>
          <TempateDashboardCardWrap>
            <TempateDashboardCard />
          </TempateDashboardCardWrap>
          <TempateDashboardCardWrap>
            <TempateDashboardCard />
          </TempateDashboardCardWrap>
          <TempateDashboardCardWrap>
            <TempateDashboardCard />
          </TempateDashboardCardWrap>
          <TempateDashboardCardWrap>
            <TempateDashboardCard />
          </TempateDashboardCardWrap>
        </TempateDashboardCards>
      </TemplateDashboardContainer>
    </>
  ),
);
