import styled from 'styled-components';
import { constantColor } from 'global-styled/global-constants';

export const EtsTrTbody = styled.tr<{ enable?: boolean, selected?: boolean }>`
  &&& {
    cursor: ${({ enable }) => enable ? 'pointer' : 'default'};
    pointer-events: ${({ enable }) => enable ? 'all' : 'none'};

    &:nth-of-type(odd) {
      background-color: white;
    }
    &:nth-of-type(even) {
      background-color: #f9f9f9;
    }

    &:hover {
      td {
        color: white;
        background-color: ${constantColor.colorLightGreen};
      }
    }

    td {
      color: ${({ selected }) => selected ? 'white' : 'initial'};
      background-color: ${({ selected }) => selected ? constantColor.colorGreen : 'initial'};
    }
  }
`;
