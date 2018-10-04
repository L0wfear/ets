import * as React from 'react';

import {
  CardTitleContainer,
  CardTitleContainerWrap,
  CardBodyContainer,
} from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';

import {
  InfoCardWrapContainer,
  CardInfoContainer,
} from 'components/dashboard/new/menu/cards/_default-card-component/info-card/styled/styled';

type PropsInfoCard = {
  title: React.ReactNode;
  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

const InfoCard: React.SFC<PropsInfoCard> = props => (
  <InfoCardWrapContainer>
    <CardInfoContainer>
      <CardTitleContainer>
        <CardTitleContainerWrap>
          <div>{props.title}</div>
          <div className="pointer" onClick={props.handleClose}>X</div>
        </CardTitleContainerWrap>
      </CardTitleContainer>
      <CardBodyContainer>
        { props.children }
      </CardBodyContainer>
    </CardInfoContainer>
  </InfoCardWrapContainer>
);

export default InfoCard;
