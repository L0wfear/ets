import * as React from 'react';

import TableContainer from 'components/new/ui/registry/components/data/table-data/table-container/TableContainer';
import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';

type PropsTableData = {
  registryKey: string;
  components?: any;
  handleClickOnRow: any;
  handleDoubleClickOnRow: any;
};

type StateTableData = {
};

class TableData extends React.PureComponent<PropsTableData, StateTableData> {
  render() {
    const { props } = this;
    const {
      registryKey,
    } = props;

    return (
      <EtsTableDataContainer>
        <TableContainer registryKey={registryKey} handleClickOnRow={props.handleClickOnRow} handleDoubleClickOnRow={props.handleDoubleClickOnRow} />
      </EtsTableDataContainer>
    );
  }
}

export default TableData;
