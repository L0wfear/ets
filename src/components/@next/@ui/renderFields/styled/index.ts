import styled from 'styled-components';
import { SelectFieldUi } from 'components/@next/@ui/renderFields/SelectField/styled';
import { ErrorField } from 'components/@next/@ui/renderFields/ErrorsBlock/styled/ErrorField';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const SingleUiElementWrapperStyled = styled.div`
  margin-bottom: 10px;
  position: relative;
  /* ${SelectFieldUi} {
    border-radius: 0px;
  } */
  &&& ${ErrorField} {
    margin-top: 5px;
    padding-left: 0px;

    /* New error v1 сырая */
    /* position: absolute;
    left: 0px;
    background: ${UiConstants.colorError};
    color: #fff;
    border-radius: 10px;
    padding: 5px 10px;
    z-index: 10;
    &::before {
      content: '';
      position: absolute;
      bottom: calc(100% - 5px);
      left: 16px;
      width: 8px;
      height: 8px;
      background-color: #e26240;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    } */

    /* New error v2 сырая */
    /* background: ${UiConstants.colorError};
    color: #fff;
    border-radius: 10px;
    padding: 5px 10px;
    width: auto;
    display: inline-flex;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 16px;
      width: 8px;
      height: 8px;
      background-color: #e26240;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    } */

    /* New error v3 сырая */
    /* background: ${UiConstants.colorError};
    color: #fff;
    border-radius: 0 0 ${UiConstants.colorError} ${UiConstants.colorError};
    padding: 5px 10px;
    width: auto;
    display: inline-flex;
    margin-top: 0px; */
  }
  .form-group {
    margin-bottom: 0px;
  }
`;

export const FieldLabel = styled.label`
  margin-bottom: 5px;
  white-space: pre-wrap; /* что бы можно было писаать символ переноса строки { Текст /n лейбла} */
`;
