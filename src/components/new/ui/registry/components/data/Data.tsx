import * as React from 'react';

import Header from 'components/new/ui/registry/components/data/header/Header';
import FiltersWrap from 'components/new/ui/registry/components/data/filters/FiltersWrap';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';

import { EtsDataContainer } from 'components/new/ui/registry/components/data/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { DispatchProp, connect } from 'react-redux';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

import { getHeaderData } from '../../module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import SelectForTechnicalOperationRelationsRegistryWrap from './SelectForTechnicalOperationRelationsRegistryWrap';

type DataStateProps = {
  format: OneRegistryData['header']['format'];
};
type DataDispatchProps = DispatchProp;
type DataOwnProps = {
  registryKey: string;
};
type DataMergedProps = (
  DataStateProps
  & DataDispatchProps
  & DataOwnProps
);
type DataProps = DataMergedProps;

const Data: React.FC<DataProps> = (props) => {
  const {
    registryKey,
  } = props;

  if (props.format === 'select_for_technical_operation_relations') {
    return (
      <EtsDataContainer>
        <Header registryKey={registryKey} />
        <SelectForTechnicalOperationRelationsRegistryWrap registryKey={registryKey} />
      </EtsDataContainer>
    );
  }

  return (
    <EtsDataContainer>
      <Header registryKey={registryKey} />
      <FiltersWrap registryKey={registryKey} />
      <TableData registryKey={registryKey} />
      <Paginator registryKey={registryKey} />
    </EtsDataContainer>
  );
};

export default connect<DataStateProps, DataDispatchProps, DataOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    format: getHeaderData(getRegistryState(state), registryKey).format,
  }),
)(Data);
