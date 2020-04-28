import styled from 'styled-components';
import { SingleUiElementWrapperStyled } from 'components/@next/@ui/renderFields/styled';
import { fadeInAnimation } from 'global-styled/global-animation';

export const ColumnPopupContainer = styled.div`
  max-height: 600px;
  overflow: auto;
  margin: 0px;
`;

export const ColumnPopupContainerWrapper = styled.div`
  border-radius: 3px;
  position: absolute;
  padding: 15px;
  line-height: normal;
  font-size: 14px;
  white-space: normal;
  color: #000;
  border: 1px solid #c1c1c1;
  z-index: 1;

  min-width: 250px;

  box-shadow: 0 1px 0 0 rgba(0,0,0,.1), 0 1px 15px 0 rgba(0,0,0,.1);
  background: #ffffff;
  margin-top: 15px;

  ${SingleUiElementWrapperStyled} {
    margin: 5px 0px;
  }
  animation: ${fadeInAnimation} .2s ease-in;


  &:before, &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 100%;
    width: 0;
    height: 0;
    z-index: 1;
  }
  &:before {
    left: 18px;
    border: 12px solid transparent;
    border-bottom-color: #ddd;
  }
  &:after {
    left: 20px;
    border: 10px solid transparent;
    border-bottom-color: #fff;
  }
  > div {
    cursor: pointer;

    label {
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
