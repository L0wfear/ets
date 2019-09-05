import styled from 'styled-components';
import { EtsTable } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';

import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';

// import { EtsGridTable } from 'components/new/ui/@bootstrap/grid_bootstrap/table/table';
// import EtsGridBootstrapTbody from 'components/new/ui/@bootstrap/grid_bootstrap/tbody/tbody';
// import EtsGridBootstrapThead from 'components/new/ui/@bootstrap/grid_bootstrap/thead/thead';

// const EtsGridBootstrap = {
//   GridTable: EtsGridTable,
//   GridBootstrapThead: EtsGridBootstrapThead,
//   GridBootstrapTbody: EtsGridBootstrapTbody,
// };

const EtsGridBootstrap = {
  GridTable: EtsTable,
  GridBootstrapThead: {
    Thead: styled.thead``,
    Tr: styled.tr``,
    Th: EtsTheadTh,
  },
  GridBootstrapTbody: {
    Tbody: styled.tbody``,
    Tr: EtsTrTbody,
    Td: EtsTbodyTrTd,
  },
};

export default EtsGridBootstrap;
