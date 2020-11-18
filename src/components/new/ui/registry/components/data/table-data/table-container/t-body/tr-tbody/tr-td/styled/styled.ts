import styled from 'styled-components';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';
import { SingleUiElementWrapperStyled } from 'components/@next/@ui/renderFields/styled';

export const EtsTbodyScrollContainer = styled.div`
  max-height: 120px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #4c4c4c;
    opacity: 1;
  }
`;

export const EtsTbodyTextContainer = styled.div`
  pointer-events: none;
`;

export const EtsTdInnerWrapper = styled.div`
  display: block;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

export const EtsTbodyTrTd = styled.td<{ alignCenter?: boolean; }>`
  &&& {
    padding: 8px;
    border: 1px solid white;
    vertical-align: ${({ alignCenter }) => alignCenter ? 'center' : 'top'};
    text-align: ${({ alignCenter }) => alignCenter ? 'center' : 'left'};
    word-break: break-word;
    input {
      cursor: pointer;
    }

    ${ButtonStyled} {
      margin: 0 1px 10px;
      min-height: 38px;
    }
    ${SingleUiElementWrapperStyled} {
      width: 100%
    }
    input {
      &[disabled] {
        background: #eee;
      }
    }
  }
  .col-md-12 {
    position: initial;
  }
`;
