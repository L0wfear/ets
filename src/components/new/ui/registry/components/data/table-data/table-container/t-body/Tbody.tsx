import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { getListData, selectorShowArray } from 'components/new/ui/registry/module/selectors-registry';

import TrTbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/TrTbody';
import {
  StatePropsTbody,
  DispatchPropsTbody,
  OwnPropsTbody,
  PropsTbody,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/Tbody.h';
import { ReduxState } from 'redux-main/@types/state';

import { EtsTrTbody } from './tr-tbody/styled/styled';
import { EtsTbodyTrTd } from './tr-tbody/tr-td/styled/styled';

const Tbody: React.FC<PropsTbody> = React.memo(
  (props) => {
    return (
      <tbody>
        {
          props.showArray.map((rowData, indexRow) => (
            <TrTbody
              key={rowData[props.uniqKey]}
              rowData={rowData}
              registryKey={props.registryKey}
              indexRow={indexRow}
            />
          ))
        }
        {
          Boolean(!props.showArray.length && props.rowFields.length) && (
            <EtsTrTbody registryKey={props.registryKey}>
              <EtsTbodyTrTd colSpan={props.rowFields.length}>Нет данных</EtsTbodyTrTd>
            </EtsTrTbody>
          )
        }
      </tbody>
    );
  },
);

export default compose<PropsTbody, OwnPropsTbody>(
  connect<StatePropsTbody, DispatchPropsTbody, OwnPropsTbody, ReduxState>(
    (state, { registryKey }) => ({
      showArray: selectorShowArray(state, registryKey),
      rowFields: getListData(state.registry, registryKey).meta.rowFields,
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
    }),
  ),
)(Tbody);
