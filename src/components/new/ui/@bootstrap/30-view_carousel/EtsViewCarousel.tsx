import styled from 'styled-components';

const EtsViewCarousel = styled.div<{ manual?: boolean; indexShow?: number }>`
  display: flex;
  overflow-x: hidden;

  >* {
    flex-shrink: 0;
    transform: ${({ indexShow }) => `translate(-${indexShow * 100}%, 0)`};
    transition: transform 0.5s;
    will-change: transform;
    width: 100%;
  }
`;

export default EtsViewCarousel;
