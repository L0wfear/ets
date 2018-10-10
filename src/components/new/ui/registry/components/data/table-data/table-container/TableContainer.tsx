import * as React from 'react';

import Thead from 'components/new/ui/registry/components/data/table-data/table-container/t-head/Thead';
import Tbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/Tbody';
import { EtsTableWrap, EtsTable } from './styled/styled';

type PropsTableContainer = {
  registryKey: string;
};

type StateTableContainer = {
};

class TableContainer extends React.Component<PropsTableContainer, StateTableContainer> {
  render() {
    const { registryKey } = this.props;

    return (
      <EtsTableWrap>
        <EtsTable className="ets_table" striped bordered condensed>
          <Thead registryKey={registryKey} />
          <Tbody registryKey={registryKey} />
        </EtsTable>
      </EtsTableWrap>
    );
  }
}

export default TableContainer;
