import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const TextAreaFieldUi = styled.textarea`
  &&& {
    border-radius: ${UiConstants.borderFieldRadius};
    .has-error {
      border-radius: ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} 0
    }
  }
`;
