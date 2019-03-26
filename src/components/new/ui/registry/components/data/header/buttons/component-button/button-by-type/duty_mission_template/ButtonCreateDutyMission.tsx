import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
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
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import dutyMissionTemplatePermissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';

type ButtonCreateDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCreateDutyMissionDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
};
type ButtonCreateDutyMissionOwnProps = {
  registryKey: string;
};
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
      props.registrySetSelectedRowToShowInForm(
        props.registryKey,
        {},
      );

      props.setParams({
        [props.uniqKey]: buttonsTypes.create,
        type: buttonsTypes.duty_missions_by_templates,
      });
    },
    [disabled, missionsAsArray],
  );

  return (
      <Button id="open-update-form" bsSize="small" onClick={handleClick} disabled={disabled}>
        Сформировать наряд-задание
      </Button>
  );
};

export default compose<ButtonCreateDutyMissionProps, ButtonCreateDutyMissionOwnProps>(
  withRequirePermissionsNew({
    permissions: dutyMissionTemplatePermissions.create,
  }),
  connect<ButtonCreateDutyMissionStateProps, ButtonCreateDutyMissionDispatchProps, ButtonCreateDutyMissionOwnProps, ButtonCreateDutyMissionMergeProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      registrySetSelectedRowToShowInForm: (...arg) => (
        dispatch(
          registrySetSelectedRowToShowInForm(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonCreateDutyMission);
