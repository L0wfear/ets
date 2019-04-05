import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import {
  StatePropsTrTdEnumerated,
  DispatchPropsTrTdEnumerated,
  OwnPropsTrTdEnumerated,
  PropsTrTdEnumerated,
  StateTrTdEnumerated,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTd.h';

class TrTdEnumerated extends React.PureComponent<PropsTrTdEnumerated, StateTrTdEnumerated> {
  render() {
    const {
      paginator,
      indexRow,
    } = this.props;

    return (
      <EtsTbodyTrTd>
        {indexRow + 1 + paginator.currentPage * paginator.perPage}
      </EtsTbodyTrTd>
    );

  }
}

export default connect<StatePropsTrTdEnumerated, DispatchPropsTrTdEnumerated, OwnPropsTrTdEnumerated, ReduxState>(
  (state, { registryKey }) => ({
    paginator: getListData(state.registry, registryKey).paginator,
  }),
)(TrTdEnumerated);
