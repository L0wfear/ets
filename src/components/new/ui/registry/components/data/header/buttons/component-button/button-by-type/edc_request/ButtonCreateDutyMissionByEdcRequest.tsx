import * as React from 'react';
import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCreateDutyMissionByEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCreateDutyMissionByEdcRequestDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonCreateDutyMissionByEdcRequestOwnProps = CommonTypesForButton & {};
type ButtonCreateDutyMissionByEdcRequestMergeProps = (
  ButtonCreateDutyMissionByEdcRequestStateProps
  & ButtonCreateDutyMissionByEdcRequestDispatchProps
  & ButtonCreateDutyMissionByEdcRequestOwnProps
);

type ButtonCreateDutyMissionByEdcRequestProps = (
  ButtonCreateDutyMissionByEdcRequestMergeProps
  & WithSearchProps
);

class ButtonCreateDutyMissionByEdcRequest extends React.PureComponent<ButtonCreateDutyMissionByEdcRequestProps, {}> {
  handleClick = () => {
    this.props.setParams({
      [this.props.uniqKeyForParams]: get(this.props.selectedRow, this.props.uniqKey, null),
      type: buttonsTypes.edc_request_create_duty_mission,
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    const can_create_duty_mission = get(props.selectedRow, 'can_create_duty_mission', false);

    return (
      <EtsBootstrap.Button id={`${props.registryKey}.open-create_duty_mission_by_edc-form`} bsSize="small" onClick={this.handleClick} disabled={!can_create_duty_mission}>
        <EtsBootstrap.Glyphicon glyph="plus" /> Создать наряд-задание
      </EtsBootstrap.Button>
    );
  }
}

export default compose<ButtonCreateDutyMissionByEdcRequestProps, ButtonCreateDutyMissionByEdcRequestOwnProps>(
  withSearch,
  withRequirePermission({
    permissions: dutyMissionPermissions.update,
  }),
  connect<ButtonCreateDutyMissionByEdcRequestStateProps, ButtonCreateDutyMissionByEdcRequestDispatchProps, ButtonCreateDutyMissionByEdcRequestOwnProps, ReduxState>(
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
)(ButtonCreateDutyMissionByEdcRequest);
