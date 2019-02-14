import styled from 'styled-components';
import { Dropdown, Button } from 'react-bootstrap';

export const DropdownWrap = styled(Dropdown)`
  &&& {
    button {
      float: initial;
    }
  }
`;

export const WaybillEquipmentButton = styled(Button)`
  &&& {
    &.btn.active[disabled] {
      background-color: #6a9e56 !important;
      &:hover {
        color: white;
      }
    }
  }
`;
