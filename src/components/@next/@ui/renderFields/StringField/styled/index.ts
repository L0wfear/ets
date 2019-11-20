import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import EtsFormControl from 'components/new/ui/@bootstrap/17-form_control/EtsFormControl';

export const StringFieldUi = styled(EtsFormControl)`
  border-radius: ${UiConstants.borderFieldRadius};
  padding-left: 0px!important;
  text-indent: 12px;
  &.has-error {
    border-radius: ${UiConstants.borderFieldRadius};
  }
  &&& {
    &:focus {
      box-shadow: none;
    }
  }
`;
