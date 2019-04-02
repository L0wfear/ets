import * as React from 'react';

import Thead from 'components/new/ui/registry/components/data/table-data/table-container/t-head/Thead';
import Tbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/Tbody';
import {
  EtsTableWrap,
  EtsTable,
} from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { setStickyThead } from 'utils/stickyTableHeader';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { compose } from 'recompose';

type TableContainerStateProps = {
  fixedWidth: OneRegistryData['list']['data']['fixedWidth'];
};
type TableContainerDispatchProps = {};
type TableContainerOwnProps = {
  registryKey: string;
  handleClickOnRow: any;
  handleDoubleClickOnRow: any;
};
type TableContainerMergeProps = (
  TableContainerStateProps
  & TableContainerDispatchProps
  & TableContainerOwnProps
);

type TableContainerProps = TableContainerMergeProps;

const TableContainer: React.FC<TableContainerProps> = (props) => {
  React.useEffect(
    () => {
      setStickyThead('.ets_table_wrap', true);
      return () => setStickyThead('.ets_table_wrap', false);
    },
    [],
  );
  const { registryKey } = props;

  return (
    <EtsTableWrap className="ets_table_wrap">
      <EtsTable fixedWidth={props.fixedWidth}>
        <Thead registryKey={registryKey} />
        <Tbody
          registryKey={registryKey}
          handleClickOnRow={props.handleClickOnRow}
          handleDoubleClickOnRow={props.handleDoubleClickOnRow}
        />
      </EtsTable>
    </EtsTableWrap>
  );
};

export default compose<TableContainerProps, TableContainerOwnProps>(
  connect<TableContainerStateProps, TableContainerDispatchProps, TableContainerOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      fixedWidth: getListData(state.registry, registryKey).data.fixedWidth,
    }),
  ),
)(TableContainer);
