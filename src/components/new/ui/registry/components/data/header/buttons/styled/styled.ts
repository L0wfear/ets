import styled from 'styled-components';
import { mobiSize } from 'global-styled/global-constants';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';

type EtsButtonsContainerProps = {
  marginBtnX?: number;
  marginBtnY?: number;
  marginContainerX?: number;
  marginContainerY?: number;
  justifyContent?: string;
};

const defaultMargin = 2.5;

export const EtsButtonsContainer = styled.div<EtsButtonsContainerProps>`
  display: flex;
  flex-wrap: wrap;
  margin: ${({ marginContainerX, marginContainerY }) => `${marginContainerY || 0}px ${marginContainerX || 0}px `};
  justify-content: ${({ justifyContent }) => (justifyContent ? justifyContent : 'flex-end')};
  >* {
    margin: ${({ marginBtnX, marginBtnY }) => `${marginBtnY || defaultMargin}px ${marginBtnX || defaultMargin}px `};
  }

  /* Для кнопок, обернутых в ClickOutHandler */
  & > div > ${ButtonStyled} {
    min-height: 100%;
  }

  @media screen and (max-width: ${mobiSize}px) {
    justify-content: center;
  }
`;
