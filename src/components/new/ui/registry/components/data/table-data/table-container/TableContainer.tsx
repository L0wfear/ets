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
import { getListData, getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { compose } from 'recompose';
import { getRegistryState } from 'redux-main/reducers/selectors';

type TableContainerStateProps = {
  fixedWidth: OneRegistryData['list']['data']['fixedWidth'];
  format: OneRegistryData['header']['format'];
};
type TableContainerDispatchProps = {};
type TableContainerOwnProps = {
  registryKey: string;
};
type TableContainerMergeProps = (
  TableContainerStateProps
  & TableContainerDispatchProps
  & TableContainerOwnProps
);

type TableContainerProps = TableContainerMergeProps;

const getAddToMinusHeight = (format: OneRegistryData['header']['format']) => {
  switch (format) {
    case 'select_for_technical_operation_relations': return 100;
    default: return 0;
  }
};

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
    <EtsTableWrap className="ets_table_wrap" addToMinusHeight={getAddToMinusHeight(props.format)}>
      <EtsTable fixedWidth={props.fixedWidth}>
        <Thead registryKey={registryKey} />
        <Tbody registryKey={registryKey} />
      </EtsTable>
    </EtsTableWrap>
  );
};

export default compose<TableContainerProps, TableContainerOwnProps>(
  connect<TableContainerStateProps, TableContainerDispatchProps, TableContainerOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      fixedWidth: getListData(state.registry, registryKey).data.fixedWidth,
      format: getHeaderData(getRegistryState(state), registryKey).format,
    }),
  ),
)(TableContainer);
