import styled from 'styled-components';
import { mobiSize } from 'global-styled/global-constants';

export const DataTableHeadLineTitle = styled.div`
  white-space: nowrap;
`;

export const DataTableHeadLine = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${mobiSize}px) {
    flex-wrap: wrap;
    justify-content: center;

    ${DataTableHeadLineTitle} {
      white-space: normal;
    }
  }
`;
