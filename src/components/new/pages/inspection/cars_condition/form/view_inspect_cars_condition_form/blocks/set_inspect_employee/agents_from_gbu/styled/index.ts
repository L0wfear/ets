import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { FooterEnd } from 'global-styled/global-styled';
import { fadeInAnimation } from 'global-styled/global-animation';

export const AgentsFromGbuDataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;
export const RowAddRowAddAgentFromGbuWrapper = styled.div`
  &&& ${ButtonStyled} {
    width: auto!important;
  }
`;

export const AgentsFromGbuMemberDataContainer = styled.div`
  border-radius: 3px;
  margin: 5px 0;

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
  ${FooterEnd} {
    position: absolute;
    right: 8px;
    top: -1px;
  }
`;

export const AgentsFromGbuWrapper = styled.div`
  .error {
    margin-top: 0px;
    margin-bottom: 10px;
  }
`;

export const AgentsFromGbuCloseBtn = styled(EtsBootstrap.Button)`
  &&& {
    background: transparent;
    color: #4c4c4c;
    padding: 0px;
    &:hover{
      background: transparent;
      color: ${UiConstants.colorError};
    }
  }
`;

export const AgentsFromGbuAddBtn = styled(EtsBootstrap.Button)`
  margin-top: 10px;
`;
