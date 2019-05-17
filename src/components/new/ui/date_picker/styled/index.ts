import styled from 'styled-components';
import * as Col from 'react-bootstrap/lib/Col';
import { Row } from 'react-bootstrap';
import { mobiSize } from 'global-styled/global-constants';

export const ColStartDatePickerRange = styled(Col)`
  &&& {
    @media (min-width: 992px) {
      width: 49.5%;
    }
  }
`;
export const ColDividerDatePickerRange = styled(Col)<{ label: any; date_start_label: any }>`
  &&& {
    display: none;
    text-align: center;
    bottom: ${(props) => props.label || props.date_start_label ? '-24px' : '0px'};
    @media (min-width: 992px) {
      display: initial;
      width: 1%;
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
  position: relative;

  min-width: 450px;
  @media screen and (max-width: ${mobiSize}px) {
    min-width: 0;
  }
`;

export const WithDatePickerRangeRegistry = styled(Row)`
  padding: 15px;
  padding-bottom: 0;

  ${DatePickerRangeContainer} {
    margin: 0;
  }
`;
