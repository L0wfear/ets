import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const AdditionalInfoBlock = styled.div`
  border-radius: 3px;
  padding: 20px 15px;
  border: 1px solid #ddd;
  margin-top: 15px;
  position: relative;
  animation: ${fadeIn} .3s ease-in;
  &:before, &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 100%;
    width: 0;
    height: 0;
  }
  &:before {
    left: 19px;
    border: 11px solid transparent;
    border-bottom-color: #ddd;
  }
  &:after {
    left: 20px;
    border: 10px solid transparent;
    border-bottom-color: #fff;
  }
`;

export const AdditionalInfoWrapper = styled.div`
  margin-bottom: 15px;
`;
