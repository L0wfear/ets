import styled from 'styled-components';

export const AppStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const AppContent = styled.div`
  justify-self: flex-start;
  flex: 1 1 auto;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const AppContentContainer = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
`;
