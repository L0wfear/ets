import * as React from 'react';

import TableContainer from 'components/new/ui/registry/components/data/table-data/table-container/TableContainer';
import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';

type Props = {
  registryKey: string;
};

const TableData: React.FC<Props> = React.memo(
  (props) => {
    return (
      <EtsTableDataContainer>
        <TableContainer registryKey={props.registryKey} />
      </EtsTableDataContainer>
    );
  },
);

export default TableData;
