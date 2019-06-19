import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { get } from 'lodash';

import {
  StatePropsTrTdCheckbox,
  DispatchPropsTrTdCheckbox,
  OwnPropsTrTdCheckbox,
  PropsTrTdCheckbox,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTd.h';
import { ExtField } from 'components/ui/new/field/ExtField';
import { registryCheckLine } from 'components/new/ui/registry/module/actions-registy';

const TrTdCheckbox: React.FC<PropsTrTdCheckbox> = (props) => {
  const onClick = React.useCallback(
    () => {
      props.registryCheckLine(
        props.registryKey,
        props.rowData,
      );
    },
    [props.rowData, props.registryCheckLine, props.registryKey],
  );

  return (
    <EtsTbodyTrTd onClick={onClick} >
      <ExtField
        type="boolean"
        error={false}
        label={false}
        value={props.isChecked}
        className="pointer"
      />
    </EtsTbodyTrTd>
  );
};

export default connect<StatePropsTrTdCheckbox, DispatchPropsTrTdCheckbox, OwnPropsTrTdCheckbox, ReduxState>(
  (state, { registryKey, rowData }) => ({
    isChecked: get(getListData(state.registry, registryKey).data.checkedRows, rowData[getListData(state.registry, registryKey).data.uniqKey], false),
  }),
  (dispatch: any) => ({
    registryCheckLine: (...arg) => (
      dispatch(
        registryCheckLine(...arg),
      )
    ),
  }),
)(TrTdCheckbox);
