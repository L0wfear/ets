import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import TrTbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/TrTbody';
import {
  StatePropsTbody,
  DispatchPropsTbody,
  OwnPropsTbody,
  PropsTbody,
  StateTbody,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/Tbody.h';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';

class Tbody extends React.Component<PropsTbody, StateTbody> {
  render() {
    const { props } = this;
    const {
      paginator: {
        currentPage,
        perPage,
      },
    } = props;

    return (
      <tbody>
        {
          this.props.processedArray.slice(currentPage * perPage, (currentPage + 1) * perPage).map((rowData, indexRow) => (
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

export default compose<PropsTbody, OwnPropsTbody>(
  withSearch,
  connect<StatePropsTbody, DispatchPropsTbody, OwnPropsTbody, ReduxState>(
    (state, { registryKey }) => ({
      processedArray: getListData(state.registry, registryKey).processed.processedArray,
      paginator: getListData(state.registry, registryKey).paginator,
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
    }),
  ),
)(Tbody);
