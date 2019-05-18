import styled from 'styled-components';
import { borderRadiusButton } from 'global-styled/global-constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const DropdownWrap = styled(EtsBootstrap.Dropdown)`
  &&& {
    button {
      float: initial;
    }
    .btn-default {
      border-radius: ${borderRadiusButton};
    }
  }
`;
