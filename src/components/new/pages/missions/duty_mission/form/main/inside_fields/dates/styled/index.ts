import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const ColStartDatePicker = styled(EtsBootstrap.Col)`
  &&& {
    @media (min-width: 992px) {
      width: 49%;
    }

    margin-bottom: 15px;
  }
`;
export const ColDividerDatePicker = styled(EtsBootstrap.Col)`
  &&& {
    visibility: hidden;
    text-align: center;
    @media (min-width: 992px) {
      visibility: initial;
      width: 2%;
      margin: 0;
      padding: 8px 0 0 0;
      display: flex;
      justify-content: center;
    }
  }
`;
export const ColEndDatePicker = styled(ColStartDatePicker)``;
