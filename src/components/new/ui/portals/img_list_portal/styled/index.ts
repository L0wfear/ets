import styled from 'styled-components';

export const BlockContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ImageListContainer = styled(BlockContainer)`
  position: absolute;
  top: 0;
  z-index: 10000000;

  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
