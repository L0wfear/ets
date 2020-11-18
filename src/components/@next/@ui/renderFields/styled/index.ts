import styled from 'styled-components';

import { ErrorField } from 'components/@next/@ui/renderFields/ErrorsBlock/styled/ErrorField';

import { fadeInAnimation } from 'global-styled/global-animation';

export const SingleUiElementWrapperStyled = styled.div`
  margin-bottom: 10px;
  position: relative;
  input[type=number], input[type=string] {
    width: 100%;
    min-width: 1px;
  }
  &&& ${ErrorField} {
    margin-top: 5px;
    padding-left: 0px;
  }
  .form-group {
    margin-bottom: 0px;
  }
  animation: ${fadeInAnimation} .2s ease-in;
`;

export const FieldLabel = styled.label`
  margin-bottom: 5px;
  white-space: pre-wrap; /* что бы можно было писаать символ переноса строки { Текст /n лейбла} */
`;
