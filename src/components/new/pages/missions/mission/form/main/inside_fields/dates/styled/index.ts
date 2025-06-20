import styled from 'styled-components';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const FieldDatesMissionContainer = styled.div`
  margin-bottom: 15px;
`;

export const ColStartDatePicker = styled(EtsBootstrap.Col)`
  &&& {
    @media (min-width: 992px) {
      width: 49%;
    }
  }
`;

export const ExtFieldDateStartWrap: any = styled(ExtField)`
  width: 100%;
`;

export const ColStartDatePickerWithDropdown = styled(ColStartDatePicker)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
export const ColDividerDatePicker = styled(EtsBootstrap.Col)`
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
