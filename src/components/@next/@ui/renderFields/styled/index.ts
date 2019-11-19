import styled from 'styled-components';
import { ErrorField } from 'components/@next/@ui/renderFields/ErrorsBlock/styled/ErrorField';

export const SingleUiElementWrapperStyled = styled.div`
  white-space: pre;

  margin-bottom: 10px;
  position: relative;

  &&& ${ErrorField} {
    margin-top: 5px;
    padding-left: 0px;
  }
  .form-group {
    margin-bottom: 0px;
  }
`;

export const FieldLabel = styled.label`
  margin-bottom: 5px;
`;
