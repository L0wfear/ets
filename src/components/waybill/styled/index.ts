import styled from 'styled-components';
import { Dropdown } from 'react-bootstrap';
import { borderRadiusButton } from 'global-styled/global-constants';

export const DropdownWrap = styled(Dropdown)`
  &&& {
    button {
      float: initial;
    }
    .btn-default {
      border-radius: ${borderRadiusButton};
    }
  }
`;
