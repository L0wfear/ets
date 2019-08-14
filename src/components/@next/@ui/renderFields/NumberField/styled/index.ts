import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const NumberFieldUi = styled(EtsBootstrap.FormControl)`
  &&& {
    border-radius: ${UiConstants.borderFieldRadius};
    .form-control {
      border-radius: ${UiConstants.borderFieldRadius};
    }
    .has-error {
      border-radius: ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} 0
    }
  }
`;
