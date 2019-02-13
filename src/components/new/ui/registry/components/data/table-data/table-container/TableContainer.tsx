import * as React from 'react';

import Thead from 'components/new/ui/registry/components/data/table-data/table-container/t-head/Thead';
import Tbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/Tbody';
import {
  EtsTableWrap,
  EtsTable,
} from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { setStickyThead } from 'utils/stickyTableHeader';

type PropsTableContainer = {
  registryKey: string;
  components?: any;
  handleClickOnRow: any;
  handleDoubleClickOnRow: any;
};

type StateTableContainer = {};

class TableContainer extends React.Component<
  PropsTableContainer,
  StateTableContainer
> {
  componentDidMount() {
    setStickyThead('.data-table .griddle', true);
  }

  componentWillUnmount() {
    setStickyThead('.data-table .griddle', false);
  }

  render() {
    const { props } = this;
    const { registryKey, components } = props;

    return (
      <EtsTableWrap>
        <EtsTable className="ets_table" bordered condensed>
          <Thead registryKey={registryKey} />
          <Tbody
            registryKey={registryKey}
            components={components}
            handleClickOnRow={props.handleClickOnRow}
            handleDoubleClickOnRow={props.handleDoubleClickOnRow}
          />
        </EtsTable>
      </EtsTableWrap>
    );
  }
}

export default TableContainer;
