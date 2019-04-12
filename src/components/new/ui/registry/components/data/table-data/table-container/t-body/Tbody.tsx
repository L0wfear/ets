import * as React from 'react';
import { connect } from 'react-redux';
import { getListData, getServiceData } from 'components/new/ui/registry/module/selectors-registry';
import { get } from 'lodash';

import TrTbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/TrTbody';
import {
  StatePropsTbody,
  DispatchPropsTbody,
  OwnPropsTbody,
  PropsTbody,
  StateTbody,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/Tbody.h';
import { ReduxState } from 'redux-main/@types/state';

class Tbody extends React.Component<PropsTbody, StateTbody> {
  render() {
    const { props } = this;
    const {
      paginator: {
        currentPage,
        perPage,
      },
      Service,
    } = props;
    const userServerFilters = get(Service, 'getRegistryData.userServerFilters', false);

    const currentPageEdit = userServerFilters ? 0 : currentPage;

    return (
      <tbody>
        {
          this.props.processedArray.slice(currentPageEdit * perPage, (currentPageEdit + 1) * perPage).map((rowData, indexRow) => (
            <TrTbody
              key={rowData[props.uniqKey]}
              rowData={rowData}
              registryKey={props.registryKey}
              indexRow={indexRow}
              handleClickOnRow={props.handleClickOnRow}
              handleDoubleClickOnRow={props.handleDoubleClickOnRow}
            />
          ))
        }
      </tbody>
    );
  }
}

export default connect<StatePropsTbody, DispatchPropsTbody, OwnPropsTbody, StatePropsTbody & DispatchPropsTbody, ReduxState>(
  (state, { registryKey }) => ({
    Service: getServiceData(state.registry, registryKey),
    processedArray: getListData(state.registry, registryKey).processed.processedArray,
    paginator: getListData(state.registry, registryKey).paginator,
    uniqKey: getListData(state.registry, registryKey).data.uniqKey,
  }),
  null,
  null,
  {
    pure: false,
  },
)(Tbody);
