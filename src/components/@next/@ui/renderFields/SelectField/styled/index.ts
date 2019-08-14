import styled from 'styled-components';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const SelectFieldUi = styled(ReactSelect)`
  &&& {
    border-radius: ${UiConstants.borderFieldRadius};
    .has-error {
      border-radius: ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} ${UiConstants.borderFieldRadius} 0
    }
  }
`;
