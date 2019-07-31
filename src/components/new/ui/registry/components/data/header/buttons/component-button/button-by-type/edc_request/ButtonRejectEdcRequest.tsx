import * as React from 'react';
import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import edcRequestPermissions from 'components/new/pages/edc_request/_config-data/permissions';

type ButtonRejectEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonRejectEdcRequestDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonRejectEdcRequestOwnProps = {
  registryKey: string;
};
type ButtonRejectEdcRequestMergeProps = {};

type ButtonRejectEdcRequestProps = (
  ButtonRejectEdcRequestStateProps
  & ButtonRejectEdcRequestDispatchProps
  & ButtonRejectEdcRequestOwnProps
  & ButtonRejectEdcRequestMergeProps
) & WithSearchProps;

class ButtonRejectEdcRequest extends React.PureComponent<ButtonRejectEdcRequestProps, {}> {
  handleClick = () => {
    this.props.setParams({
      [this.props.uniqKeyForParams]: get(this.props.selectedRow, this.props.uniqKey, null),
      type: buttonsTypes.edc_request_reject,
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    const can_reject = get(props.selectedRow, 'can_reject', false);

    return (
      <EtsBootstrap.Button id="open-cancel_edc_reject--form" bsSize="small" onClick={this.handleClick} disabled={!can_reject}>
        Отклонить
      </EtsBootstrap.Button>
    );
  }
}

export default compose<ButtonRejectEdcRequestProps, ButtonRejectEdcRequestOwnProps>(
  withSearch,
  withRequirePermissionsNew({
    permissions: edcRequestPermissions.update,
  }),
  connect<ButtonRejectEdcRequestStateProps, ButtonRejectEdcRequestDispatchProps, ButtonRejectEdcRequestOwnProps, ReduxState>(
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
)(ButtonRejectEdcRequest);
