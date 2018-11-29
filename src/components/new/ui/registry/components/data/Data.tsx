import * as React from 'react';

import Header from 'components/new/ui/registry/components/data/header/Header';
import FiltersWrap from 'components/new/ui/registry/components/data/filters/FiltersWrap';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';

import { EtsDataContainer } from 'components/new/ui/registry/components/data/styled/styled';

type PropsData = {
  registryKey: string;
  components?: any;
  handleClickOnRow: any;
  handleDoubleClickOnRow: any;
};

type StateData = {

};

class Data extends React.Component<PropsData, StateData> {
  render() {
    const { props } = this;
    const {
      registryKey,
      components,
    } = props;

    return (
      <EtsDataContainer>
        <Header registryKey={registryKey} components={components} />
        <FiltersWrap registryKey={registryKey} components={components} />
        <TableData registryKey={registryKey} components={components} handleClickOnRow={props.handleClickOnRow} handleDoubleClickOnRow={props.handleDoubleClickOnRow }/>
        <Paginator registryKey={registryKey} components={components} />
      </EtsDataContainer>
    );
  }
}

export default Data;
