import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { get } from 'lodash';

import TrTd from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTd';
import TrTdEnumerated from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTdEnumerated';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { isObject } from 'util';
import { ReduxState } from 'redux-main/@types/state';

import {
  StatePropsTrTbody,
  DipatchPropsTrTbody,
  OwnPropsTrTbody,
  PropsTrTbody,
  StateTrTbody,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/TrTbody.h';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { registrySetSelectedRowToShowInForm, registrySelectRow } from 'components/new/ui/registry/module/actions-registy';

class TrTbody extends React.Component<PropsTrTbody, StateTrTbody> {
  renderRow = ({ key }) => {
    const { props } = this;

    const {
      components,
      rowData,
      registryKey,
    } = props;
    let StandartTrTd = TrTd;

    if (isObject(components)) {
      StandartTrTd = components.TrTd || StandartTrTd;
    }

    if (key === 'enumerated') {
      return (
        <TrTdEnumerated
          key={key}
          indexRow={props.indexRow}
          registryKey={registryKey}
        />
      );
    }

    return (
      <StandartTrTd
        key={key}
        metaKey={key}
        value={rowData[key]}
        rowData={rowData}
        registryKey={registryKey}
      />
    );
  }

  handleClick: React.MouseEventHandler<HTMLTableRowElement> = () => {
    const { props } = this;

    if (props.handleClickOnRow) {
      props.handleClickOnRow(
        props.rowData,
      );
    } else {
      this.props.registryHandleClickOnRow(
        props.rowData,
      );
    }
  }

  handleDoubleClick: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
    const { props } = this;

    if (props.handleDoubleClickOnRow) {
      props.handleDoubleClickOnRow(
        props.rowData,
      );
    } else {
      this.props.registryHandleDoubleClickOnRow(
        props.rowData,
      );
    }
  }

  render() {
    const { props } = this;
    return (
      <EtsTrTbody
        enable
        selected={props.rowData[props.uniqKey] === props.selectedUniqKey}
        rowData={props.rowData}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        { props.rowFields.map(this.renderRow) }
      </EtsTrTbody>
    );
  }
}

export default compose<PropsTrTbody, OwnPropsTrTbody>(
  connect<StatePropsTrTbody, DipatchPropsTrTbody, OwnPropsTrTbody, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      rowFields: getListData(state.registry, registryKey).meta.rowFields,
      permissions: getListData(state.registry, registryKey).permissions.read,

      selectedUniqKey: get(getListData(state.registry, registryKey), ['data', 'selectedRow', getListData(state.registry, registryKey).data.uniqKey], null),
    }),
    (dispatch, { registryKey }) => ({
      registryHandleClickOnRow: (rowData) => (
        dispatch(
          registrySelectRow(
            registryKey,
            rowData,
          ),
        )
      ),
      registryHandleDoubleClickOnRow: (rowData) => (
        dispatch(
          registrySetSelectedRowToShowInForm(
            registryKey,
            rowData,
          ),
        )
      ),
    }),
  ),
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
)(TrTbody);
