import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonReadEmployeeOnCarStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonReadEmployeeOnCarDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonReadEmployeeOnCarOwnProps = CommonTypesForButton & {};
type ButtonReadEmployeeOnCarMergeProps = {};

type ButtonReadEmployeeOnCarProps = (
  ButtonReadEmployeeOnCarStateProps
  & ButtonReadEmployeeOnCarDispatchProps
  & ButtonReadEmployeeOnCarOwnProps
  & ButtonReadEmployeeOnCarMergeProps
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

class ButtonReadEmployeeOnCar extends React.Component<ButtonReadEmployeeOnCarProps, {}> {
  handleClick = () => {
    this.props.setParams({
      car_actual_asuods_id: get(this.props.selectedRow, 'asuods_id', null),
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    return (
      <EtsBootstrap.Button id={`${props.registryKey}.open-update_car-form`} bsSize="small" onClick={this.handleClick} disabled={!props.selectedRow}>
        Просмотреть карточку ТС
      </EtsBootstrap.Button>
    );
  }
}

export default compose<ButtonReadEmployeeOnCarProps, ButtonReadEmployeeOnCarOwnProps>(
  connect<{ permissions: (string | boolean)[] }, DispatchProp, { registryKey: string }, {}, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getPermissionsReadUpdate(getListData(state.registry, registryKey).permissions), //  прокидывается в следующий компонент
    }),
    null,
    null,
    {
      pure: false,
    },
  ),
  withRequirePermissionsNew(),
  connect<ButtonReadEmployeeOnCarStateProps, ButtonReadEmployeeOnCarDispatchProps, ButtonReadEmployeeOnCarOwnProps, ButtonReadEmployeeOnCarMergeProps, ReduxState>(
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
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonReadEmployeeOnCar);
