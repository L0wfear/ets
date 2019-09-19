import * as React from 'react';
import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import edcRequestPermissions from 'components/new/pages/edc_request/_config-data/permissions';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCancelEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCancelEdcRequestDispatchProps = {
};
type ButtonCancelEdcRequestOwnProps = CommonTypesForButton & {};
type ButtonCancelEdcRequestMergeProps = {};

type ButtonCancelEdcRequestProps = (
  ButtonCancelEdcRequestStateProps
  & ButtonCancelEdcRequestDispatchProps
  & ButtonCancelEdcRequestOwnProps
  & ButtonCancelEdcRequestMergeProps
) & WithSearchProps;

class ButtonCancelEdcRequest extends React.PureComponent<ButtonCancelEdcRequestProps, {}> {
  handleClick = () => {
    this.props.setParams({
      [this.props.uniqKeyForParams]: get(this.props.selectedRow, this.props.uniqKey, null),
      type: buttonsTypes.edc_request_cancel,
    });
  }

  render() {
    const { props } = this;

    const can_cancel = get(props.selectedRow, 'can_cancel', false);

    return (
      <EtsBootstrap.Button id="open-cancel_edc_request--form" bsSize="small" onClick={this.handleClick} disabled={!can_cancel}>
        Отменить
      </EtsBootstrap.Button>
    );
  }
}

export default compose<ButtonCancelEdcRequestProps, ButtonCancelEdcRequestOwnProps>(
  withSearch,
  withRequirePermission({
    permissions: edcRequestPermissions.update,
  }),
  connect<ButtonCancelEdcRequestStateProps, ButtonCancelEdcRequestDispatchProps, ButtonCancelEdcRequestOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
  ),
)(ButtonCancelEdcRequest);
