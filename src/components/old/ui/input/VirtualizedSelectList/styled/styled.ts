import styled from 'styled-components';

import { Option } from 'components/old/ui/input/ReactSelect/styled/styled';

export const VirtualizedOption = styled.div`
  text-overflow: ellipsis!important;
  overflow: hidden!important;
  white-space: nowrap;
  max-width: 100%;
  ${Option} > * {
    text-overflow: ellipsis!important;
    overflow: hidden!important;
    white-space: nowrap;
    max-width: 100%;
  }
  & > * {
    text-overflow: ellipsis!important;
    overflow: hidden!important;
    white-space: nowrap;
    max-width: 100%;
  }
`;
