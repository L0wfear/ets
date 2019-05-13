import styled from 'styled-components';
import * as Col from 'react-bootstrap/lib/Col';
import { Dropdown } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';

export const FieldDatesMissionContainer = styled.div`
  margin-bottom: 15px;
`;

export const ColStartDatePicker = styled(Col)`
  &&& {
    @media (min-width: 992px) {
      width: 49%;
    }
  }
`;

export const DropdownDateEnd = styled(Dropdown)`
  >button {
    height: 38px;
  }
`;
export const ExtFieldDateStartWrap: any = styled(ExtField)`
  width: 100%;
`;

export const ColStartDatePickerWithDropdown = styled(ColStartDatePicker)`
  display: flex;
  justify-content: space-between;
`;
export const ColDividerDatePicker = styled(Col)`
  &&& {
    visibility: hidden;
    @media (min-width: 992px) {
      visibility: initial;
      width: 2%;
      margin: 0;
      padding: 8px 0 0 0;
      display: block;
    }
  }
`;
export const ColEndDatePicker = styled(ColStartDatePicker)``;
