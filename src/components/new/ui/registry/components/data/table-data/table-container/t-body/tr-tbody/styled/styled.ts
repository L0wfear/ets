import styled from 'styled-components';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { constantColor } from 'global-styled/global-constants';

export const EtsTrTbody = styled<{ enable: boolean, selected: boolean } , 'tr'>('tr')`
  &.ets-tr {
    cursor: ${({ enable }) => enable ? 'pointer' : 'default'}

    &:nth-of-type(odd) {
      background-color: white;
    }
    &:nth-of-type(even) {
      background-color: #f9f9f9;
    }

    &:hover {
      ${EtsTbodyTrTd} {
        color: white;
        background-color: ${constantColor.colorLightGreen};
      }
    }

    ${EtsTbodyTrTd} {
      color: ${({ selected }) => selected ? 'white' : 'initial'};
      background-color: ${({ selected }) => selected ? constantColor.colorGreen : 'initial'};
    }
  }
`;