import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import EtsFormControl from 'components/new/ui/@bootstrap/17-form_control/EtsFormControl';

export const NumberFieldUi = styled(EtsFormControl)`
  border-radius: ${UiConstants.borderFieldRadius};
  &.has-error {
    border-radius: ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} 0
  }
  &&& {
    &:focus {
      box-shadow: none;
    }
  }
`;
