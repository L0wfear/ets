import styled from 'styled-components';
import { mobiSize } from 'global-styled/global-constants';
import EtsBootstrap from '../../@bootstrap';

export const ColStartDatePickerRange = styled(EtsBootstrap.Col)`
  &&& {
    @media (min-width: 992px) {
      width: 49%;
    }
  }
`;
export const ColDividerDatePickerRange = styled(EtsBootstrap.Col)<{label: any}>`
  &&& {
    display: none;
    text-align: center;
    bottom: ${(props) => props.label ? '-24px' : '0px'};
    @media (min-width: 992px) {
      width: 2%;
      margin: 0;
      padding: 8px 0 0 0;
      display: flex;
      justify-content: center;
    }
  }
`;
export const ColEndDatePickerRange = styled(ColStartDatePickerRange)``;

export const DatePickerRangeContainer = styled(EtsBootstrap.Row)<{ allWidth?: boolean }>`
  width: ${({ allWidth }) => allWidth ? '100%' : 'initial'};
  margin-bottom: 5px;
  position: relative;

  min-width: 460px;
  @media screen and (max-width: ${mobiSize}px) {
    min-width: 0;
  }
`;

export const WithDatePickerRangeRegistry = styled(EtsBootstrap.Row)`
  padding: 15px;
  padding-bottom: 0;

  ${DatePickerRangeContainer} {
    margin: 0;
  }
`;
