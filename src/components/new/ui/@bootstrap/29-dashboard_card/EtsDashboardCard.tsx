import * as React from 'react';
import styled from 'styled-components';
import themeDashboard from '../@themes/default/dashboard/themeDashboard';

export const EtsDashboardCardContainerWrap = styled.div<{ block?: boolean; themeName?: keyof typeof themeDashboard }>`
  transition: all 0.5s;
  width: ${({ block, theme, themeName }) => (
    block
    ? '100%'
    : `${100 / theme.dashboard[themeName || 'default'].countBlockInLine}%`
  )};
  padding: 10px;
  position: relative;

  @media screen and (max-width: 990px) {
    min-width: 100%;
    padding: 5px 0;
  }
`;

export const EtsDashboardCardContainer = styled.div<{ themeName?: keyof typeof themeDashboard }>`
  transition: all 0.5s;

  background-color: ${({ theme, themeName }) => theme.dashboard[themeName || 'default'].backgroundColor};
  color: ${({ theme, themeName }) => theme.dashboard[themeName || 'default'].color};
  border-radius: 4px;

  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(0, 0, 0, 0.2);

  ul {
    padding-left: 20px;
  }
`;

export type EtsDashboardCardProps = {
  themeName?: keyof typeof themeDashboard;
  block?: boolean;
};

const EtsDashboardCard: React.FC<EtsDashboardCardProps> = React.memo(
  (props) => {
    return (
      <EtsDashboardCardContainerWrap block={props.block} themeName={props.themeName}>
        <EtsDashboardCardContainer themeName={props.themeName}>
          {props.children}
        </EtsDashboardCardContainer>
      </EtsDashboardCardContainerWrap>
    );
  },
);

export default EtsDashboardCard;
