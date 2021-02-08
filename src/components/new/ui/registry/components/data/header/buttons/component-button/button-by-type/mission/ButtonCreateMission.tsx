import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCreateMissionStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};
type ButtonCreateMissionDispatchProps = {
};
type ButtonCreateMissionOwnProps = CommonTypesForButton & {};
type ButtonCreateMissionMergeProps = {};

type ButtonCreateMissionProps = (
  ButtonCreateMissionStateProps
  & ButtonCreateMissionDispatchProps
  & ButtonCreateMissionOwnProps
  & ButtonCreateMissionMergeProps
) & WithSearchProps;

const ButtonCreateMission: React.FC<ButtonCreateMissionProps> = (props) => {
  const handleClick = React.useCallback(
    () => {
      props.setParams({
        [props.uniqKeyForParams]: buttonsTypes.create,
      });
    },
    [props.setParams, props.match.params, props.setDataInSearch, props.searchState],
  );

  return (
    <EtsBootstrap.Button id={`${props.registryKey}.open-create_mission_by_templates-form`} bsSize="small" onClick={handleClick}>
      <EtsBootstrap.Glyphicon glyph="plus" /> Создать децентрализованное задание
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateMissionProps, ButtonCreateMissionOwnProps>(
  withSearch,
  connect<{  permissions: OneRegistryData['list']['permissions']['delete']; }, DispatchProp, { registryKey: string; }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
  connect<ButtonCreateMissionStateProps, ButtonCreateMissionDispatchProps, ButtonCreateMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKeyForParams: getListData(state.registry, registryKey)?.data.uniqKeyForParams,
    }),
  ),
)(ButtonCreateMission);
