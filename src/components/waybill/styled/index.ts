import styled from 'styled-components';
import { Dropdown, Button } from 'react-bootstrap';
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

export const WaybillEquipmentButton = styled(Button)`
  &&& {
    &.btn {
      &.active[disabled] {
      background-color: #6a9e56 !important;
      &:hover {
        color: white;
      }
    }
  }
`;
