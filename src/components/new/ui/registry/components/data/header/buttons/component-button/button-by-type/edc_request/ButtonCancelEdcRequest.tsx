import * as React from 'react';
import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
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
import missionPermissions from 'components/missions/mission/config-data/permissions';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

type ButtonCancelEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCancelEdcRequestDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonCancelEdcRequestOwnProps = {
  registryKey: string;
};
type ButtonCancelEdcRequestMergeProps = {};

type ButtonCancelEdcRequestProps = (
  ButtonCancelEdcRequestStateProps
  & ButtonCancelEdcRequestDispatchProps
  & ButtonCancelEdcRequestOwnProps
  & ButtonCancelEdcRequestMergeProps
) & WithSearchProps;

class ButtonCancelEdcRequest extends React.Component<ButtonCancelEdcRequestProps, {}> {
  handleClick: React.MouseEventHandler<Button> = () => {
    this.props.setParams({
      [this.props.uniqKeyForParams]: get(this.props.selectedRow, this.props.uniqKey, null),
      type: buttonsTypes.edc_request_cancel,
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    const can_cancel = get(props.selectedRow, 'can_cancel', false);

    return (
      <Button id="open-cancel_edc_request--form" bsSize="small" onClick={this.handleClick} disabled={!can_cancel}>
        Отменить
      </Button>
    );
  }
}

export default compose<ButtonCancelEdcRequestProps, ButtonCancelEdcRequestOwnProps>(
  withRequirePermissionsNew({
    permissions: missionPermissions.update,
  }),
  connect<ButtonCancelEdcRequestStateProps, ButtonCancelEdcRequestDispatchProps, ButtonCancelEdcRequestOwnProps, ButtonCancelEdcRequestMergeProps, ReduxState>(
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
)(ButtonCancelEdcRequest);
