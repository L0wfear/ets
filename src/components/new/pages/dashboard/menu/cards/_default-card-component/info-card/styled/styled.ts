import styled from 'styled-components';
import { EtsDashboardCardContainer } from 'components/new/ui/@bootstrap/29-dashboard_card/EtsDashboardCard';
import { fadeInAnimation } from 'global-styled/global-animation';

export const InfoCardWrapContainer = styled.div`
  position: absolute;
  pointer-events: none;

  top: -10px;
  left: calc(100% - 10px);
  width: calc(100% + 20px);
  min-width: 320px;

  @media screen and (max-width: 990px) {
    top: 100%;
    left: 0;
  }
`;

export const CardInfoContainer = styled.div`
  pointer-events: all;
  position: absolute;
  z-index: 1;
  animation: ${fadeInAnimation} .2s ease-in;
  ${EtsDashboardCardContainer} {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 15px 0px;
  }
`;
