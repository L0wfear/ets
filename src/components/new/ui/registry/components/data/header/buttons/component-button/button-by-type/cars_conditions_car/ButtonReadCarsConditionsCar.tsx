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

type ButtonReadCarsConditionsCarStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonReadCarsConditionsCarDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonReadCarsConditionsCarOwnProps = CommonTypesForButton & {};
type ButtonReadCarsConditionsCarMergeProps = {};

type ButtonReadCarsConditionsCarProps = (
  ButtonReadCarsConditionsCarStateProps
  & ButtonReadCarsConditionsCarDispatchProps
  & ButtonReadCarsConditionsCarOwnProps
  & ButtonReadCarsConditionsCarMergeProps
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

class ButtonReadCarsConditionsCar extends React.Component<ButtonReadCarsConditionsCarProps, {}> {
  handleClick = () => {
    this.props.setParams({
      typeRightView: 'car_info',
      selectedCarsConditionsCar: get(this.props.selectedRow, this.props.uniqKey, null),
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    return (
      <EtsBootstrap.Button id={`${props.registryKey}.open-show_card-form`} bsSize="small" onClick={this.handleClick} disabled={!props.selectedRow}>
        Просмотреть карточку
      </EtsBootstrap.Button>
    );
  }
}

export default compose<ButtonReadCarsConditionsCarProps, ButtonReadCarsConditionsCarOwnProps>(
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
  connect<ButtonReadCarsConditionsCarStateProps, ButtonReadCarsConditionsCarDispatchProps, ButtonReadCarsConditionsCarOwnProps, ButtonReadCarsConditionsCarMergeProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
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
)(ButtonReadCarsConditionsCar);
