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
import { compose } from 'recompose';
import memoizeOne from 'memoize-one';

class Tbody extends React.PureComponent<PropsTbody, StateTbody> {
  render() {
    const { props } = this;

    return (
      <tbody>
        {
          this.props.showArray.map((rowData, indexRow) => (
            <TrTbody
              key={rowData[props.uniqKey]}
              rowData={rowData}
              registryKey={props.registryKey}
              indexRow={indexRow}
            />
          ))
        }
      </tbody>
    );
  }
}

const makeShowArray = memoizeOne(
  (processedArray, paginator) => {
    const {
      currentPage,
      perPage,
    } = paginator;

    return processedArray.slice(currentPage * perPage, (currentPage + 1) * perPage);
  },
);

export default compose<PropsTbody, OwnPropsTbody>(
  connect<StatePropsTbody, DispatchPropsTbody, OwnPropsTbody, ReduxState>(
    (state, { registryKey }) => ({
      showArray: makeShowArray(
        getListData(state.registry, registryKey).processed.processedArray,
        getListData(state.registry, registryKey).paginator,
      ),
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
    }),
  ),
)(Tbody);
