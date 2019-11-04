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
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import dutyMissionTemplatePermissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCreateDutyMissionStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCreateDutyMissionDispatchProps = {
};
type ButtonCreateDutyMissionOwnProps = CommonTypesForButton & {};
type ButtonCreateDutyMissionMergeProps = {};

type ButtonCreateDutyMissionProps = (
  ButtonCreateDutyMissionStateProps
  & ButtonCreateDutyMissionDispatchProps
  & ButtonCreateDutyMissionOwnProps
  & ButtonCreateDutyMissionMergeProps
) & WithSearchProps;

const ButtonCreateDutyMission: React.FC<ButtonCreateDutyMissionProps> = (props) => {
  const missionsAsArray = Object.values(props.checkedRows);

  const disabled = (
    !missionsAsArray.length
    || missionsAsArray.some(({ kind_task_ids = [] }) => !kind_task_ids.includes(3))
  );

  const handleClick = React.useCallback(
    async () => {
      props.setParams({
        [props.uniqKeyForParams]: buttonsTypes.create,
        type: buttonsTypes.duty_missions_by_templates,
      });
    },
    [disabled, missionsAsArray, props.match, props.setParams],
  );

  return (
    <EtsBootstrap.Button id={`${props.registryKey}.open-create_duty_mission_by_template-form`}bsSize="small" onClick={handleClick} disabled={disabled}>
        Сформировать наряд-задание
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateDutyMissionProps, ButtonCreateDutyMissionOwnProps>(
  withSearch,
  withRequirePermission({
    permissions: dutyMissionTemplatePermissions.create,
  }),
  connect<ButtonCreateDutyMissionStateProps, ButtonCreateDutyMissionDispatchProps, ButtonCreateDutyMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
  ),
)(ButtonCreateDutyMission);
