import styled, { css } from 'styled-components';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';
import { mobiSize } from 'global-styled/global-constants';

export const ImgContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;

  width: 100%;
  height: 100%;

  position: relative;
  transform: translate(0, 0);
`;

export const ImgListBodyContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
`;

export const ImgBackground = styled.div<{ src: string; }>`
  background: ${({ src }) => `url(${encodeURI(src)})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100%;
  height: 100%;
`;

const cssRight = css`
  right: 0;
`;
const cssLeft = css`
  left: 0;
`;

export const NavigationImageContainer = styled.div<{ type: 'left' | 'right';}>`
  width: 75px;
  flex-shrink: 0;
  justify-content: center;
  display: flex;
  height: 100%;

  @media screen and (max-width: ${mobiSize}px) {
    position: absolute;
    ${({ type }) => (
    type === 'right'
      ? cssRight
      : (
        type === 'left'
          ? cssLeft
          : null
      )
  )}
  }

  &&& {
    ${ButtonStyled} {
      height: 100%;
    }
  }
`;
