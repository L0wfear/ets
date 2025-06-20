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
import missionTemplatePermissions from 'components/new/pages/missions/mission_template/_config-data/permissions';
import { getWarningNotification } from 'utils/notifications';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCreateMissionTemplateStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCreateMissionTemplateDispatchProps = {
};
type ButtonCreateMissionTemplateOwnProps = CommonTypesForButton & {};
type ButtonCreateMissionTemplateMergeProps = {};

type ButtonCreateMissionTemplateProps = (
  ButtonCreateMissionTemplateStateProps
  & ButtonCreateMissionTemplateDispatchProps
  & ButtonCreateMissionTemplateOwnProps
  & ButtonCreateMissionTemplateMergeProps
) & WithSearchProps;

const ButtonCreateMissionTemplate: React.FC<ButtonCreateMissionTemplateProps> = (props) => {
  const missionsAsArray = Object.values(props.checkedRows);

  const disabled = (
    !missionsAsArray.length
    || missionsAsArray.some(({ kind_task_ids = [], is_actual }) => !kind_task_ids.includes(3) || !is_actual)
  );

  const handleClick = React.useCallback(
    async () => {
      if (missionsAsArray.some(({ front_invalid_interval }) => front_invalid_interval)) {
        global.NOTIFICATION_SYSTEM.notify(
          getWarningNotification(
            'Выбраны шаблоны, которые создадут одинаковые задания, с пересекающимся периодом. Необходимо исключить пересекающиеся шаблоны (выделены красным)',
          ),
        );
        return;
      }

      props.setParams({
        [props.uniqKeyForParams]: buttonsTypes.create,
        type: buttonsTypes.missions_by_templates,
      });
    },
    [disabled, missionsAsArray, props.match, props.setParams],
  );

  return (
    <EtsBootstrap.Button id={`${props.registryKey}.open-create_mission_by_template-form`} bsSize="small" onClick={handleClick} disabled={disabled}>
        Сформировать децентрализованное задание
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateMissionTemplateProps, ButtonCreateMissionTemplateOwnProps>(
  withSearch,
  withRequirePermission({
    permissions: missionTemplatePermissions.create,
  }),
  connect<ButtonCreateMissionTemplateStateProps, ButtonCreateMissionTemplateDispatchProps, ButtonCreateMissionTemplateOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
  ),
)(ButtonCreateMissionTemplate);
