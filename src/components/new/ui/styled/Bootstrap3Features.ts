import styled from 'styled-components';
import { ColFilter } from 'components/old/ui/tableNew/filter/styled';

export const FilterRowsContainerDataTable = styled.div`
  @media screen and (min-width: 1200px) {
    ${ColFilter}:nth-child(4n + 1) {
      clear: left;
    }
  }
  @media screen and (max-width: 1200px) and (min-width: 992px) {
    ${ColFilter}:nth-child(3n + 1) {
      clear: left;
    }
  }
  @media screen and (max-width: 992px) {
    ${ColFilter}:nth-child(2n + 1) {
      clear: left;
    }
  }
`;
