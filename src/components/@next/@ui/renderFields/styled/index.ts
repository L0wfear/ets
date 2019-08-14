import styled from 'styled-components';
import { SelectFieldUi } from 'components/@next/@ui/renderFields/SelectField/styled';
import { ErrorField } from 'components/@next/@ui/renderFields/ErrorsBlock/styled/ErrorField';

export const SingleUiElementWrapperStyled = styled.div`
  margin-bottom: 10px;
  ${SelectFieldUi} {
    border-radius: 0px;
  }
  ${ErrorField} {
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
