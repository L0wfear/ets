import styled from 'styled-components';

export const InfoCardWrapContainer = styled.div`
  position: absolute;
  pointer-events: none;

  top: 0;
  left: 100%;
  width: 100%;

  @media screen and (max-width: 990px) {
    top: 100%;
    left: 0;
  }
`;

export const CardInfoContainer = styled.div`
  pointer-events: all;
  position: absolute;
  z-index: 1;
`;
