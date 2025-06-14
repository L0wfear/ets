import styled from 'styled-components';
import { mobiSize } from 'global-styled/global-constants';
import EtsBootstrap from '../../@bootstrap';

export const DividerDatePickerRange = styled.div<{ hasLabel: boolean; }>`
  &&& {
    display: none;
    text-align: center;
    @media (min-width: 992px) {
      width: auto;
      left: 50%;
      transform: translate(-50%, 0);
      top: ${({ hasLabel }) => hasLabel ? '25%' : '0'};
      position: absolute;
      margin: 0;
      padding: 8px 0 0 0;
      display: flex;
      justify-content: center;
    }
  }
`;
export const DatePickerRangeContainer = styled(EtsBootstrap.Row)<{ allWidth?: boolean; }>`
  width: ${({ allWidth }) => allWidth ? '100%' : 'initial'};
  margin-bottom: 5px;
  position: relative;

  min-width: 450px;
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
