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
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
            <div className="pointer" onClick={props.handleClose}>X</div>
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
