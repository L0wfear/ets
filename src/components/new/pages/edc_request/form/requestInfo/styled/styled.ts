import styled from 'styled-components';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';
import { EtsTableWrap } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { EtsPaginatorContainer } from 'components/new/ui/registry/components/data/paginator/styled/styled';

export const RequestHistoryCreateDate = styled.h5`

`;

export const RequestHistoryListRegistry = styled.div`
`;

export const RequestHistoryListWrapper = styled.div`
  margin-top: 10px;
  ${EtsHeaderContainer} {
    display: none!important;
  }
  ${EtsTableDataContainer} {
    padding: 10px 0px;
    padding-top: 0px;
  }
  ${EtsTableWrap} {
    margin: 0px;
  }
  ${EtsPaginatorContainer} {
    padding: 0px;
    margin: 0px;
    margin-bottom: 10px;
  }
`;
