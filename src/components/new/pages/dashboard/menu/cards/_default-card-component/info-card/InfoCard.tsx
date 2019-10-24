import * as React from 'react';

import {
  CardTitleContainer,
  CardTitleContainerWrap,
  CardBodyContainer,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';

import {
  InfoCardWrapContainer,
  CardInfoContainer,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/styled/styled';
import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const CardInfoCloseBtn = styled.div`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  font-size: 20px;
  font-weight: 700;
  color: #000;
  line-height: 1.2;
  cursor: pointer;

  color: black;
  transition: opacity 0.3s, color 0.3s;
  will-change: opacity;

  :hover {
    color: ${UiConstants.colorError};
  }
`;

type PropsInfoCard = {
  title: React.ReactNode;
  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

const InfoCard: React.FC<PropsInfoCard> = React.memo(
  (props) => (
    <InfoCardWrapContainer>
      <CardInfoContainer>
        <EtsBootstrap.DashboardCard block>
        <CardTitleContainer>
          <CardTitleContainerWrap>
            <div>{props.title}</div>
            <CardInfoCloseBtn onClick={props.handleClose}>
              ×
            </CardInfoCloseBtn>
          </CardTitleContainerWrap>
        </CardTitleContainer>
        <CardBodyContainer>
          { props.children }
        </CardBodyContainer>
        </EtsBootstrap.DashboardCard>
      </CardInfoContainer>
    </InfoCardWrapContainer>
  ),
);

export default InfoCard;
