import styled from 'styled-components';

import {
  CardContainer,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';

export const InfoCardWrapContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
  min-width: 220px;
  max-width: 73%;

  @media screen and (max-width: 990px) {
    top: 100%;
    width: 100%;
    max-width: initial;
  }
`;

export const InfoCardContainer = styled.div`
  margin-bottom: 30px;
  pointer-events: all;
  box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.3);

  border: 1px solid black;
  transform: translate(100%) translate(20px);
  width: 100%;

  @media screen and (max-width: 990px) {
    transform: translate(0, 20px);
  }
`;

export const CardInfoContainer = styled(CardContainer)`
  margin-bottom: 30px;
  pointer-events: all;
  box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.3);
  z-index: 1;

  border: 1px solid black;
  transform: translate(100%) translate(20px);
  width: 100%;

  @media screen and (max-width: 990px) {
    transform: translate(0, 20px);
  }
`;
