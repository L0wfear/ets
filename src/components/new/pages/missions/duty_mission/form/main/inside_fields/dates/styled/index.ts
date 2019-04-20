import styled from 'styled-components';
import * as Col from 'react-bootstrap/lib/Col';

export const ColStartDatePicker = styled(Col)`
  &&& {
    @media (min-width: 992px) {
      width: 49%;
    }

    margin-bottom: 15px;
  }
`;
export const ColDividerDatePicker = styled(Col)`
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
