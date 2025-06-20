import styled from 'styled-components';
import { fadeInAnimation } from 'global-styled/global-animation';

export const AdditionalInfoBlock = styled.div`
  border-radius: 3px;
  padding: 20px 15px;
  border: 1px solid #ddd;
  margin-top: 15px;
  position: relative;
  animation: ${fadeInAnimation} .3s ease-in;
  box-shadow: 0 1px 0 0 rgba(0,0,0,.1), 0 1px 15px 0 rgba(0,0,0,.1);
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
