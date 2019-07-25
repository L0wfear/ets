import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';

type ButtonSelectStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonSelectDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonSelectOwnProps = {
  registryKey: string;
  onClick?: (item: any) => any;
};
type ButtonSelectMergeProps = {};

type ButtonSelectProps = (
  ButtonSelectStateProps
  & ButtonSelectDispatchProps
  & ButtonSelectOwnProps
  & ButtonSelectMergeProps
) & WithSearchProps;

let lasPermissions = {};
let lastPermissionsArray = [];

const getPermissionsReadUpdate = (permission) => {
  if (lasPermissions !== permission) {
    lasPermissions = permission;

    lastPermissionsArray = [permission.read, permission.update];
  }

  return lastPermissionsArray;
};

class ButtonSelect extends React.PureComponent<ButtonSelectProps, {}> {
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.selectedRow);
      return;
    }

    this.props.setParams({
      [this.props.uniqKeyForParams]: get(this.props.selectedRow, this.props.uniqKey, null),
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    return (
      <EtsBootstrap.Button id="open-update-form" bsSize="small" onClick={this.handleClick} disabled={!props.selectedRow}>
        <EtsBootstrap.Glyphicon glyph="hand-up" /> Выбрать
      </EtsBootstrap.Button>
    );
  }
}

export default compose<ButtonSelectProps, ButtonSelectOwnProps>(
  withSearch,
  connect<{ permissions: (string | boolean)[] }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getPermissionsReadUpdate(getListData(state.registry, registryKey).permissions), //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonSelectStateProps, ButtonSelectDispatchProps, ButtonSelectOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
    (dispatch: any, { registryKey }) => ({
      registrySetSelectedRowToShowInForm: () => (
        dispatch(
          registrySetSelectedRowToShowInForm(registryKey),
        )
      ),
    }),
  ),
)(ButtonSelect);
