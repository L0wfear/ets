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
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCreateMissionByEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCreateMissionByEdcRequestDispatchProps = {
};
type ButtonCreateMissionByEdcRequestOwnProps = CommonTypesForButton & {};
type ButtonCreateMissionByEdcRequestMergeProps = {};

type ButtonCreateMissionByEdcRequestProps = (
  ButtonCreateMissionByEdcRequestStateProps
  & ButtonCreateMissionByEdcRequestDispatchProps
  & ButtonCreateMissionByEdcRequestOwnProps
  & ButtonCreateMissionByEdcRequestMergeProps
) & WithSearchProps;

class ButtonCreateMissionByEdcRequest extends React.PureComponent<ButtonCreateMissionByEdcRequestProps, {}> {
  handleClick = () => {
    this.props.setParams({
      [this.props.uniqKeyForParams]: get(this.props.selectedRow, this.props.uniqKey, null),
      type: buttonsTypes.edc_request_create_mission,
    });
  };

  render() {
    const { props } = this;

    const can_create_mission = get(props.selectedRow, 'can_create_mission', false);

    return (
      <EtsBootstrap.Button id={`${props.registryKey}.open-create_mission_by_edc-form`} bsSize="small" onClick={this.handleClick} disabled={!can_create_mission}>
        <EtsBootstrap.Glyphicon glyph="plus" /> Создать децентрализованное задание
      </EtsBootstrap.Button>
    );
  }
}

export default compose<ButtonCreateMissionByEdcRequestProps, ButtonCreateMissionByEdcRequestOwnProps>(
  withSearch,
  withRequirePermission({
    permissions: missionPermissions.update,
  }),
  connect<ButtonCreateMissionByEdcRequestStateProps, ButtonCreateMissionByEdcRequestDispatchProps, ButtonCreateMissionByEdcRequestOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
  ),
)(ButtonCreateMissionByEdcRequest);
