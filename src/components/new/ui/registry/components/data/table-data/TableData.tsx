import * as React from 'react';

import TableContainer from 'components/new/ui/registry/components/data/table-data/table-container/TableContainer';
import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';

type PropsTableData = {
  registryKey: string;
};

type StateTableData = {
};

class TableData extends React.Component<PropsTableData, StateTableData> {
  render() {
    const { registryKey } = this.props;

    return (
      <EtsTableDataContainer>
        <TableContainer registryKey={registryKey} />
      </EtsTableDataContainer>
    );
  }
}

export default TableData;
