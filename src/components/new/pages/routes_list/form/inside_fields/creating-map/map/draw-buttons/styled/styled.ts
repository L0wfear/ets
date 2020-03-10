import styled from 'styled-components';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';

export const RouteDrawButtonsContaineWrapr = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  pointer-events: none;
`;

export const RouteDrawButtonsContainer = styled.div`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  pointer-events: all;
  ${ButtonStyled} {
    margin-bottom: 5px;
  }
`;
