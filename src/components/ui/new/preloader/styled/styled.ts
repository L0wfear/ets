import styled, { keyframes } from 'styled-components';

const cssload = keyframes`
  0%{width: 0px;}
  70%{width: 100%; opacity: 1;}
  90%{opacity: 0; width: 100%;}
  100%{opacity: 0; width: 0px;}
`;

export const MainPageLoader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-size: 20px;
  color: #777;
  padding-top: 150px;
  z-index: 50;
`;

export const CssloadLoader = styled.div`
  position: absolute;
  width: 146px;
  height: 19px;
  left: 25%;
  left: calc(50% - 73px);
  top: 50%;
  z-index: 100;

  &:after {
    content: 'Загрузка ...';
    text-transform: uppercase;
    color: white;
    font-family: Lato, 'Helvetica Neue';
    font-weight: 200;
    font-size: 10px;
    position: absolute;
    width: 100%;
    height: 23px;
    line-height: 23px;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 1;
    text-align: center;
  }

  :before {
    content: '';
    position: absolute;
    background-color: rgb(0, 0, 0);
    top: -3px;
    left: 0px;
    height: 29px;
    width: 0px;
    z-index: 0;
    opacity: 1;
    transform-origin: 100% 0%;
    animation: ${cssload} 8s ease-in-out infinite;
  }
`;

export const GostWeakLoadingOverlay = styled.div`
  position: fixed;
  left: 70px;
  bottom: 50px;
  width: 120px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid #666;
  border-radius: 8px;
  text-align: center;
  padding: 10px;
  color: #777;
  z-index: 4;
`;
