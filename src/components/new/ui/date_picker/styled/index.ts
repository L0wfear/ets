import styled from 'styled-components';
import * as Col from 'react-bootstrap/lib/Col';
import { Row } from 'react-bootstrap';

export const ColStartDatePickerRange = styled(Col)`
  &&& {
    @media (min-width: 992px) {
      width: 49%;
    }
  }
`;
export const ColDividerDatePickerRange = styled(Col)`
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
export const ColEndDatePickerRange = styled(ColStartDatePickerRange)``;

export const DatePickerRangeContainer = styled(Row)<{ allWidth?: boolean }>`
  width: ${({ allWidth }) => allWidth ? '100%' : 'initial'};
  margin-bottom: 5px;
`;

export const WithDatePickerRangeRegistry = styled(Row)`
  padding: 15px;
  padding-bottom: 0;

  ${DatePickerRangeContainer} {
    margin: 0;
  }
`;
