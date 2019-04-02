import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import TrHead from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/TrHead';

import {
  StatePropsThead,
  DispatchPropsThead,
  OwnPropsThead,
  PropsThead,
  StateThead,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-head/Thead.h';
import { ReduxState } from 'redux-main/@types/state';
import {
  EtsThead,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';

class Thead extends React.PureComponent<PropsThead, StateThead> {
  mapRender = (thDataRow, index) => (
    <TrHead key={index} thDataRow={thDataRow} registryKey={this.props.registryKey} />
  )

  render() {
    return (
      <EtsThead>
        {
          this.props.fieldsInDeepArr.map(this.mapRender)
        }
      </EtsThead>
    );
  }
}

export default connect<StatePropsThead, DispatchPropsThead, OwnPropsThead, ReduxState>(
  (state, { registryKey }) => ({
    fieldsInDeepArr: getListData(state.registry, registryKey).meta.fieldsInDeepArr,
  }),
)(Thead);
