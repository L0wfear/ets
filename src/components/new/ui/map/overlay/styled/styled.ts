import styled from 'styled-components';

export const OverlayInsideContainer = styled.div`
  pointer-events: none;
`;

export const EtsOverlayContainer = styled.div`
  pointer-events: all;

  padding: 5px;
  min-width: 250px;

  display: flex;
  background-color: white;
  display: flex;
  flex-direction: column;

  white-space: nowrap;
  font-weight: 500;
  border-radius: 10px;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
`;

export const EtsOverlayTitleContainer = styled.div`
  padding: 5px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d7d7d7;
  font-weight: bold;
`;

export const OverlayCloseContainer = styled.div`
  margin-left: 10px;
  cursor: pointer;
`;

export const EtsOverlayBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

export const OverlayLineInfoContainer = styled.div`
  width: 100%;
  padding: 5px;
  border-bottom: 1px solid #d7d7d7;
`;

export const EtsTriangleWrapContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const EtsTriangleContainer = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
`;
