import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';

export const TitleForm = styled(EtsBootstrap.Col)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;

  padding: 5px 20px;
  background-color: #6a9e56;
  color: #ffffff;
  flex-shrink: 0;
  &&& ${ButtonStyled} {
    background-color: transparent;
  }
`;

export const ContainerForm = styled.div`
  padding: 10px 0px;
  flex-grow: 10;
  overflow: auto;

  &>.col-md-6 {
    padding-right: 5px;
    padding-left: 5px;
  }
  &>.col-md-12 {
    padding-right: 5px;
    padding-left: 5px;
  }

`;

export const FooterForm = styled(EtsBootstrap.Col)`
  background-color: #ffffff;
  border-top: solid 1px #4c4c4c;
  padding: 5px 20px;
  flex-shrink: 0;
`;

export const HiddenPageEtsContainer = styled.div<{z_index?: number;}>`
  position: absolute;
  width: 100%;
  top: 0;
  padding: 0;
  pointer-events: none;
  z-index: 2;
  height: 100%;
  overflow: hidden;

  z-index: ${ ({z_index}) => z_index ? z_index : 1000 };
`;

export const PopupBottomForm = styled.form<{ show: boolean; }>`
  pointer-events: ${({ show }) => show ? 'all' : 'none'};
  height: 100%;

  transition: all 500ms;
  opacity: ${({ show }) => show ? 1 : 0};
  transform: ${({ show }) => show ? 'translate(0, 0)' : 'translate(0, 100%)'};
  background-color: #eeeeee;

  display: flex;
  flex-direction: column;
`;

export const CheckContainerTable = styled.div`
`;

export const CheckContainerTd = styled.div`
  max-width: 33%;
  width: 33%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CheckContainerRow = styled.div<{ was_resaved: boolean; }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  border: ${({ was_resaved }) => (
    was_resaved
      ? 'solid 2px green'
      : 'solid 2px red'
  )};
  padding: 10px 15px;
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 10px;
  }
  ${CheckContainerTd}{
    &:first-child{
      justify-content: flex-start;
    }
    &:last-child{
      justify-content: flex-end;
    }
  }
`;

export const ButtonBlock = styled.div`
  button{
    margin-right: 5px;
    &:last-child {
      margin-right: 0px;
    }
  }
`;
